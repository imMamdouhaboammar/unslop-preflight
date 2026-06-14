#!/usr/bin/env node
/**
 * repair-design-md.mjs
 *
 * VDMA Auto-Repair Engine for DESIGN.md and PRODUCT.md.
 *
 * Goals:
 * - Work correctly when installed through npm, npx, or copied as a Claude Skill.
 * - Read templates from the package root, not from the user's project root.
 * - Create missing PRODUCT.md and DESIGN.md.
 * - Repair missing DESIGN.md sections and required gate content.
 * - Repair key PRODUCT.md fields needed by the gate runner.
 * - Output machine-readable JSON for autopilot.mjs.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(__dirname, '..');
const ASSETS = join(SKILL_ROOT, 'assets');
const PROJECT_ROOT = process.cwd();

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

const ok = (s) => `${c.green}  OK${c.reset} ${s}`;
const fix = (s) => `${c.yellow}  FIX${c.reset} ${s}`;
const warn = (s) => `${c.yellow}  WARN${c.reset} ${s}`;

const REQUIRED_SECTIONS = [
  'Overview',
  'Colors',
  'Typography',
  'Elevation',
  'Components',
  "Do's and Don'ts",
];

function projectPath(value, fallback) {
  const finalValue = value || fallback;
  return isAbsolute(finalValue) ? finalValue : resolve(PROJECT_ROOT, finalValue);
}

function readIfExists(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function write(filePath, content) {
  writeFileSync(filePath, content.endsWith('\n') ? content : `${content}\n`);
}

function readAsset(fileName) {
  return readIfExists(join(ASSETS, fileName));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, '\n');
}

function hasH2(content, sectionName) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(sectionName)}\\s*$`, 'mi');
  return pattern.test(content);
}

function normalizeCommonHeadingAliases(content) {
  return content
    .replace(/^##\s+Colour(s)?\s*$/gmi, '## Colors')
    .replace(/^##\s+Type\s*$/gmi, '## Typography')
    .replace(/^##\s+Typography\s+System\s*$/gmi, '## Typography')
    .replace(/^##\s+Shadow(s)?\s*$/gmi, '## Elevation')
    .replace(/^##\s+Component(s)?\s+System\s*$/gmi, '## Components')
    .replace(/^##\s+Dos\s+and\s+Donts\s*$/gmi, "## Do's and Don'ts")
    .replace(/^##\s+Do[’']s\s+and\s+Don[’']ts\s*$/gmi, "## Do's and Don'ts")
    .replace(/^##\s+Do\s+and\s+Do\s+Not\s*$/gmi, "## Do's and Don'ts");
}

function downgradeExtraH2(content) {
  const allowed = new Set(REQUIRED_SECTIONS);
  return content.replace(/^##\s+(.+?)\s*$/gm, (full, title) => {
    const clean = title.trim();
    if (allowed.has(clean)) return full;
    return `### ${clean}`;
  });
}

function extractSectionFromTemplate(template, sectionName) {
  const lines = normalizeLineEndings(template).split('\n');
  let start = -1;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^##\s+(.+?)\s*$/);
    if (match && match[1].trim() === sectionName) {
      start = i;
      break;
    }
  }

  if (start === -1) {
    return [
      `## ${sectionName}`,
      '',
      '_TODO: complete this section with product-specific decisions._',
      '',
    ].join('\n');
  }

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }

  return `${lines.slice(start, end).join('\n').trimEnd()}\n`;
}

function insertAfterHeading(content, heading, injection) {
  if (!content.includes(heading)) {
    return `${content.trimEnd()}\n\n${injection.trim()}\n`;
  }

  const start = content.indexOf(heading);
  const afterHeading = start + heading.length;
  const nextH2 = content.indexOf('\n## ', afterHeading);
  const insertAt = nextH2 === -1 ? content.length : nextH2;

  return [
    content.slice(0, insertAt).trimEnd(),
    '',
    injection.trim(),
    '',
    content.slice(insertAt).trimStart(),
  ].join('\n');
}

function appendIfMissing(content, rule) {
  if (rule.pattern.test(content)) return { content, added: false };
  return {
    content: insertAfterHeading(content, rule.after, rule.content),
    added: true,
  };
}

const REQUIRED_DESIGN_RULES = [
  {
    id: 'unslop-setup-gate',
    label: 'Unslop setup gate',
    after: '## Overview',
    pattern: /npx\s+unslop\s+skills\s+install/i,
    content: [
      '### Unslop setup gate',
      '',
      'Before any UI implementation, run:',
      '',
      '```bash',
      'npx unslop skills install',
      '```',
      '',
      'If the command cannot run, document the failure reason and continue using DESIGN.md as the source of truth. UI implementation must not start before this setup gate is attempted.',
    ].join('\n'),
  },
  {
    id: 'creative-north-star',
    label: 'Creative North Star and Visual thesis',
    after: '## Overview',
    pattern: /Creative North Star|Visual thesis/i,
    content: [
      '### Creative North Star',
      '',
      'Define the single visual thesis for the product. The UI must not rely on generic SaaS defaults.',
      '',
      '### Visual thesis',
      '',
      'The interface must be specific to the product, user situation, core workflow, risk level, and brand register.',
    ].join('\n'),
  },
  {
    id: 'design-system-baseline',
    label: 'Design System Baseline with official docs references',
    after: '## Overview',
    pattern: /Atlassian Design System|Lightning Design System|Salesforce|Polaris|Shopify|Material Design|Human Interface Guidelines|Apple|custom-hybrid/i,
    content: [
      '### Design System Baseline',
      '',
      '- Selected baseline: [Atlassian Design System | Lightning Design System (Salesforce) | Polaris (Shopify) | Material Design | Human Interface Guidelines (Apple) | custom-hybrid]',
      '- Why this baseline fits: define the product-specific rationale.',
      '- What to borrow: interaction logic, density, component semantics, accessibility behavior, navigation patterns, and feedback patterns.',
      '- What not to copy: brand colors, proprietary visual skin, irrelevant product patterns, or company-specific identity.',
      '- Official documentation checked in Standards Gate: [yes/no/source notes]',
    ].join('\n'),
  },
  {
    id: 'intake-session-gate',
    label: 'Intake Session Gate',
    after: '## Overview',
    pattern: /Intake Session Gate|INTAKE\.session\.md|intake/i,
    content: [
      '### Intake Session Gate',
      '',
      'Complete INTAKE.session.md before implementation. Capture core user, main job to be done, product promise, primary language, directionality, product risks, assumptions, and the selected design system baseline.',
      '',
      'Implementation is blocked until the intake gate is complete or explicitly marked as pass-with-assumptions.',
    ].join('\n'),
  },
  {
    id: 'standards-gate',
    label: '2026 Standards Gate',
    after: '## Overview',
    pattern: /2026 Standards Gate|STANDARDS\.search-notes\.md|WCAG 2\.2|MDN Baseline|Core Web Vitals/i,
    content: [
      '### 2026 Standards Gate',
      '',
      'Before implementation, verify current official guidance when web access exists and record it in STANDARDS.search-notes.md.',
      '',
      'Required topics:',
      '',
      '- Claude Skills packaging',
      '- Unslop setup',
      '- WCAG 2.2 AA',
      '- W3C internationalization and RTL guidance',
      '- MDN Baseline and dialog guidance',
      '- web.dev responsive design, container queries, Core Web Vitals, INP, LCP, and CLS',
      '- Official framework docs for the current stack',
      '- Official selected design system docs: Atlassian Design System, Lightning Design System (Salesforce), Polaris (Shopify), Material Design, or Human Interface Guidelines (Apple)',
    ].join('\n'),
  },
  {
    id: 'rules-engine-gate',
    label: 'Rules Engine Gate',
    after: '## Overview',
    pattern: /Rules Engine Gate|run-gates\.mjs|rules engine/i,
    content: [
      '### Rules Engine Gate',
      '',
      'Before coding, run:',
      '',
      '```bash',
      'node scripts/validate-design-md.mjs DESIGN.md',
      'node scripts/score-design-md.mjs DESIGN.md PRODUCT.md',
      'node scripts/run-gates.mjs DESIGN.md PRODUCT.md src',
      '```',
      '',
      'Implementation is blocked until failed gates are repaired.',
    ].join('\n'),
  },
  {
    id: 'ux-crx',
    label: 'UX-CRX rules',
    after: '## Overview',
    pattern: /UX-CRX|primary action|secondary action|decision point|recovery path|progressive disclosure/i,
    content: [
      '### UX-CRX rules',
      '',
      'Every screen must define: primary action, secondary action, decision point, recovery path, progressive disclosure logic, and conversion or task success event.',
    ].join('\n'),
  },
  {
    id: 'directionality',
    label: 'Directionality rules',
    after: '## Typography',
    pattern: /rtl|ltr|directionality|text-align:\s*start|logical/i,
    content: [
      '### Directionality rules',
      '',
      '- LTR is the default for English-first products.',
      '- RTL is required only when the intake confirms Arabic, Hebrew, Persian, Urdu, or another RTL-primary language.',
      '- Use logical CSS properties such as margin-inline, padding-inline, inset-inline, text-align: start, and text-align: end.',
      '- Mixed-language content such as emails, URLs, tokens, code, currencies, and numbers must use directional isolation when needed.',
    ].join('\n'),
  },
  {
    id: 'responsive',
    label: 'Responsive and mobile rules',
    after: '## Overview',
    pattern: /responsive|mobile|viewport|320|360|390|414|tablet|touch target/i,
    content: [
      '### Responsive and mobile rules',
      '',
      '- Design mobile as a first-class layout, not as desktop stacked vertically.',
      '- Test at 320, 360, 390, 414, 768, 1024, 1280, and 1440 widths.',
      '- Touch targets should be comfortable and must not crowd primary actions.',
      '- Content-heavy routes must define scroll ownership before CSS.',
    ].join('\n'),
  },
  {
    id: 'popup-feedback',
    label: 'In-app popup and feedback rules',
    after: '## Components',
    pattern: /alert\(\)|confirm\(\)|prompt\(\)|modal|drawer|toast|banner|inline validation|native browser/i,
    content: [
      '### In-app popup and feedback system',
      '',
      '- Do not use native browser alert(), confirm(), or prompt() for product flows.',
      '- Use modal for blocking decisions, drawer for secondary workflows, toast for low-risk success feedback, banner for page-level warnings, and inline validation for form errors.',
      '- Sensitive actions require explicit confirmation and must not rely only on toast feedback.',
    ].join('\n'),
  },
  {
    id: 'modal-contract',
    label: 'Modal contract',
    after: '## Components',
    pattern: /focus trap|scroll lock|inert background|Modal Contract|modal.*contract/i,
    content: [
      '### Modal Contract',
      '',
      'Every modal must define:',
      '',
      '- Accessible name through aria-labelledby or aria-label',
      '- Focus trap inside the modal',
      '- Focus restoration to the trigger after close',
      '- Inert background with no interaction while open',
      '- Body scroll lock with scroll position restored on close',
      '- Viewport-safe sizing with max height based on 100dvh',
      '- Backdrop salience that prevents background CTAs from competing with the modal CTA',
    ].join('\n'),
  },
  {
    id: 'overlay-system',
    label: 'Overlay system declaration',
    after: '## Components',
    pattern: /overlay system|ToastViewport|centralized overlay|toast\.success|toast\.error/i,
    content: [
      '### Overlay system',
      '',
      'All overlays must come from a centralized Overlay System. Manual fixed-position toast, tooltip, popover, dropdown, or tour markup inside page components is a gate blocker.',
      '',
      'Toast API examples: toast.success(), toast.error(), toast.info(). Use a single ToastViewport at the app root.',
    ].join('\n'),
  },
  {
    id: 'floating-positioning',
    label: 'Floating element positioning strategy',
    after: '## Components',
    pattern: /floating element|popup positioning|flip\(\)|shift\(|size\(|portal mounting|createPortal|Teleport/i,
    content: [
      '### Floating element positioning strategy',
      '',
      'Selected strategy: B, Floating UI or Popper.js.',
      '',
      'Dropdowns, tooltips, popovers, date pickers, comboboxes, and command menus must use flip(), shift({ padding: 8 }), and size() middleware or an equivalent viewport-safe positioning strategy.',
      '',
      'Floating elements that need to escape parent clipping must use createPortal, Teleport, or document.body mounting. Never place floating elements inside overflow-hidden parents without a portal strategy.',
    ].join('\n'),
  },
  {
    id: 'z-index-tokens',
    label: 'Z-index token scale',
    after: '## Elevation',
    pattern: /--z-|z-index token|z-sticky|z-modal|z-toast/i,
    content: [
      '### Z-index token scale',
      '',
      '```css',
      ':root {',
      '  --z-base: 0;',
      '  --z-raised: 10;',
      '  --z-sticky: 100;',
      '  --z-dropdown: 200;',
      '  --z-tooltip: 300;',
      '  --z-modal: 400;',
      '  --z-toast: 500;',
      '  --z-top: 9999;',
      '}',
      '```',
      '',
      'Magic z-index numbers are forbidden. Use tokens only.',
    ].join('\n'),
  },
  {
    id: 'semantic-html',
    label: 'Semantic HTML and keyboard rules',
    after: "## Do's and Don'ts",
    pattern: /semantic HTML|<button>|keyboard|focus-visible|tabindex|operable by keyboard|real button/i,
    content: [
      '### Semantic HTML and interaction rules',
      '',
      '- Use semantic HTML: buttons are <button>, links are <a>, navigation uses <nav>, and page content uses <main>.',
      '- All interactive controls must be operable by keyboard.',
      '- Visible focus is mandatory.',
      '- Do not use clickable div or span elements as controls.',
      '- Avoid positive tabindex.',
    ].join('\n'),
  },
  {
    id: 'realistic-content',
    label: 'Realistic content rule',
    after: "## Do's and Don'ts",
    pattern: /realistic content|realistic data|no placeholder|lorem ipsum|fake data|John Doe|example\.com/i,
    content: [
      '### Realistic content rule',
      '',
      'No lorem ipsum, John Doe, example.com, Item 1, Item 2, fake metrics, or placeholder-only UI. Use realistic product content before implementation.',
    ].join('\n'),
  },
  {
    id: 'icon-system',
    label: 'Icon system rules',
    after: '## Components',
    pattern: /icon system|sparkle|magic wand|emoji|starburst|robot icon/i,
    content: [
      '### Icon system',
      '',
      '- Define one icon family before implementation.',
      '- Decorative icons must be aria-hidden.',
      '- Functional icons need accessible names.',
      '- Do not use emojis as core UI icons.',
      '- Do not use sparkle, magic wand, starburst, glitter, generic AI brain, or robot icons unless explicitly justified by product context.',
    ].join('\n'),
  },
  {
    id: 'source-of-truth',
    label: 'DESIGN.md source of truth rule',
    after: "## Do's and Don'ts",
    pattern: /single source of truth|do not invent tokens|source of truth|DESIGN\.md.*truth/i,
    content: [
      '### Source of truth',
      '',
      'DESIGN.md is the single source of truth. Do not invent new tokens, spacing, radii, shadows, typography, or components during coding. If a rule is missing, update DESIGN.md before coding.',
    ].join('\n'),
  },
];

function fallbackDesignTemplate() {
  return [
    '# DESIGN.md',
    '',
    '## Overview',
    '',
    '### Creative North Star',
    '',
    '_Define the product-specific visual thesis._',
    '',
    '### Visual thesis',
    '',
    '_Explain why the UI should look and behave this way._',
    '',
    '## Colors',
    '',
    '### Color roles',
    '',
    '| Token | Hex | Role |',
    '|---|---|---|',
    '| --color-primary | #1D4ED8 | Primary action |',
    '| --color-surface | #FFFFFF | Main surface |',
    '| --color-text | #0F172A | Primary text |',
    '| --color-text-muted | #475569 | Secondary text |',
    '',
    '### Contrast rules',
    '',
    'Normal text must meet 4.5:1. Large text and non-text UI must meet 3:1.',
    '',
    '## Typography',
    '',
    '### Type scale',
    '',
    'Body minimum is 14px. Default body is 16px. Maximum line length is 72ch.',
    '',
    '## Elevation',
    '',
    '### Layer model',
    '',
    'Use documented shadow, border, and z-index tokens.',
    '',
    '## Components',
    '',
    '### Button',
    '',
    '- Purpose:',
    '- Anatomy:',
    '- Variants:',
    '- States:',
    '- Accessibility:',
    '',
    '## Do\'s and Don\'ts',
    '',
    '### Do',
    '',
    '- Use semantic HTML.',
    '- Use design tokens.',
    '',
    '### Don\'t',
    '',
    '- Do not use generic AI visual defaults.',
    '- Do not use native browser alert(), confirm(), or prompt() for product flows.',
    '',
  ].join('\n');
}

function repairDesignMd(designPath) {
  const repairs = [];
  const warnings = [];
  const template = readAsset('DESIGN.template.md') || fallbackDesignTemplate();

  if (!existsSync(designPath)) {
    write(designPath, template);
    repairs.push({
      id: 'design-created',
      label: 'Created DESIGN.md from template',
      type: 'create',
    });
  }

  let content = normalizeLineEndings(readIfExists(designPath));
  let modified = false;

  const normalized = normalizeCommonHeadingAliases(content);
  if (normalized !== content) {
    content = normalized;
    modified = true;
    repairs.push({
      id: 'normalized-heading-aliases',
      label: 'Normalized common section heading aliases',
      type: 'normalize',
    });
  }

  const withoutExtraH2 = downgradeExtraH2(content);
  if (withoutExtraH2 !== content) {
    content = withoutExtraH2;
    modified = true;
    repairs.push({
      id: 'downgraded-extra-h2',
      label: 'Downgraded extra top-level sections to H3',
      type: 'normalize',
    });
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!hasH2(content, section)) {
      content = `${content.trimEnd()}\n\n${extractSectionFromTemplate(template, section)}`;
      modified = true;
      repairs.push({
        id: `section-${section}`,
        label: `Added missing section: ${section}`,
        type: 'section',
      });
    }
  }

  for (const rule of REQUIRED_DESIGN_RULES) {
    const result = appendIfMissing(content, rule);
    if (result.added) {
      content = result.content;
      modified = true;
      repairs.push({
        id: rule.id,
        label: `Added: ${rule.label}`,
        type: 'field',
      });
    }
  }

  if (modified) write(designPath, content);
  return { repairs, warnings, modified };
}

function fallbackProductTemplate() {
  return [
    '# PRODUCT.md',
    '',
    '## Design System Baseline',
    '',
    '- Selected baseline: custom-hybrid',
    '- Baseline answer source: assumed',
    '- Why it fits this product:',
    '- What should be borrowed:',
    '- What must not be copied:',
    '',
    '## Product name',
    '',
    '[Product name]',
    '',
    '## Product category',
    '',
    '[Product category]',
    '',
    '## Core users',
    '',
    '[Core users]',
    '',
    '## User situation',
    '',
    '[When and why the user opens this product]',
    '',
    '## Primary job to be done',
    '',
    '[The real task]',
    '',
    '## Product promise',
    '',
    '[Concrete outcome]',
    '',
    '## Emotional register',
    '',
    '[How the product should feel]',
    '',
    '## Brand traits',
    '',
    '- Precise',
    '- Clear',
    '- Trustworthy',
    '',
    '## Main UX risks',
    '',
    '- Generic AI-looking UI',
    '- Weak accessibility',
    '- Unclear primary action',
    '',
    '## Accessibility needs',
    '',
    '- Keyboard access',
    '- Visible focus states',
    '- Color contrast',
    '- Reduced motion support',
    '- Clear error recovery',
    '',
    '## Localization needs',
    '',
    '- Primary language: English',
    '- Directionality: LTR by default unless intake confirms RTL',
    '',
    '## Success criteria',
    '',
    '- The user can complete the primary task without confusion.',
    '- The UI follows DESIGN.md without inventing visual rules.',
    '- All gates pass before implementation.',
    '',
    '## Assumptions',
    '',
    '- Product details must be replaced with real intake answers.',
    '',
  ].join('\n');
}

const REQUIRED_PRODUCT_RULES = [
  {
    id: 'product-baseline',
    label: 'PRODUCT.md Design System Baseline',
    pattern: /Design System Baseline|Selected baseline|atlassian|salesforce-lightning|shopify-polaris|material-design|apple-human-interface|custom-hybrid/i,
    content: [
      '',
      '## Design System Baseline',
      '',
      '- Selected baseline: custom-hybrid',
      '- Baseline answer source: assumed',
      '- Why it fits this product:',
      '- What should be borrowed:',
      '- What must not be copied:',
      '',
    ].join('\n'),
  },
  {
    id: 'product-success-criteria',
    label: 'PRODUCT.md success criteria',
    pattern: /success criteria/i,
    content: [
      '',
      '## Success criteria',
      '',
      '- The user can complete the primary task without confusion.',
      '- The UI follows DESIGN.md without inventing visual rules.',
      '- All gates pass before implementation.',
      '',
    ].join('\n'),
  },
  {
    id: 'product-core-user',
    label: 'PRODUCT.md core users',
    pattern: /core users|core user/i,
    content: [
      '',
      '## Core users',
      '',
      '[Define the primary user segment.]',
      '',
    ].join('\n'),
  },
  {
    id: 'product-main-job',
    label: 'PRODUCT.md primary job to be done',
    pattern: /primary job to be done|main job|job to be done/i,
    content: [
      '',
      '## Primary job to be done',
      '',
      '[Define the main task the product must help users complete.]',
      '',
    ].join('\n'),
  },
];

function repairProductMd(productPath) {
  const repairs = [];
  const warnings = [];
  const template = readAsset('PRODUCT.template.md') || fallbackProductTemplate();

  if (!existsSync(productPath)) {
    write(productPath, template);
    repairs.push({
      id: 'product-created',
      label: 'Created PRODUCT.md from template',
      type: 'create',
    });
  }

  let content = normalizeLineEndings(readIfExists(productPath));
  let modified = false;

  if (content.trim().length < 300) {
    content = `${content.trimEnd()}\n\n${fallbackProductTemplate()}`;
    modified = true;
    repairs.push({
      id: 'product-expanded',
      label: 'Expanded PRODUCT.md with minimum product contract',
      type: 'expand',
    });
  }

  for (const rule of REQUIRED_PRODUCT_RULES) {
    if (!rule.pattern.test(content)) {
      content = `${content.trimEnd()}\n${rule.content}`;
      modified = true;
      repairs.push({
        id: rule.id,
        label: `Added: ${rule.label}`,
        type: 'field',
      });
    }
  }

  if (modified) write(productPath, content);
  return { repairs, warnings, modified };
}

function ensureArtifact(fileName, assetName) {
  const target = join(PROJECT_ROOT, fileName);
  if (existsSync(target)) return null;

  const asset = readAsset(assetName);
  if (!asset) return null;

  write(target, asset);
  return {
    id: `${fileName}-created`,
    label: `Created ${fileName} from template`,
    type: 'create',
  };
}

const [,, designArg = 'DESIGN.md', productArg = 'PRODUCT.md'] = process.argv;

const designPath = projectPath(designArg, 'DESIGN.md');
const productPath = projectPath(productArg, 'PRODUCT.md');

console.log(`\n${c.bold}${c.magenta}VDMA Auto-Repair Engine${c.reset}\n`);

const allRepairs = [];
const allWarnings = [];

const intakeRepair = ensureArtifact('INTAKE.session.md', 'intake-session.template.md');
if (intakeRepair) {
  allRepairs.push(intakeRepair);
  console.log(fix(intakeRepair.label));
}

const standardsRepair = ensureArtifact('STANDARDS.search-notes.md', 'standards-search-notes.template.md');
if (standardsRepair) {
  allRepairs.push(standardsRepair);
  console.log(fix(standardsRepair.label));
}

const productResult = repairProductMd(productPath);
allRepairs.push(...productResult.repairs);
allWarnings.push(...productResult.warnings);

if (productResult.repairs.length === 0) {
  console.log(ok('PRODUCT.md: no repairs needed'));
} else {
  for (const item of productResult.repairs) console.log(fix(item.label));
}

const designResult = repairDesignMd(designPath);
allRepairs.push(...designResult.repairs);
allWarnings.push(...designResult.warnings);

if (designResult.repairs.length === 0) {
  console.log(ok('DESIGN.md: no repairs needed'));
} else {
  for (const item of designResult.repairs) console.log(fix(item.label));
}

for (const item of allWarnings) {
  console.log(warn(item));
}

console.log(`\n${allRepairs.length} repair(s) applied.\n`);

process.stdout.write(`\nVDMA_REPAIR_JSON:${JSON.stringify({
  repairs: allRepairs,
  warnings: allWarnings,
})}\n`);
