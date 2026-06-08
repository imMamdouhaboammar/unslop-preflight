#!/usr/bin/env node
/**
 * repair-design-md.mjs
 *
 * VDMA Auto-Repair Engine for DESIGN.md
 *
 * Reads a DESIGN.md, detects missing required sections and fields,
 * patches them in-place from canonical templates, and returns a repair log.
 *
 * Usage:
 *   node scripts/repair-design-md.mjs [DESIGN.md] [PRODUCT.md]
 *
 * Exits 0 whether or not repairs were needed.
 * Prints a JSON repair log to stdout so the autopilot can parse it.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(__dirname, '..');
const ASSETS = join(SKILL_ROOT, 'assets');

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  cyan: '\x1b[36m', magenta: '\x1b[35m',
};

const ok  = (s) => `${c.green}  ✓${c.reset} ${s}`;
const fix = (s) => `${c.yellow}  ↻${c.reset} ${s}`;
const err = (s) => `${c.red}  ✗${c.reset} ${s}`;

// ─── Required DESIGN.md top-level sections ──────────────────────────
const REQUIRED_SECTIONS = [
  '## Overview',
  '## Colors',
  '## Typography',
  '## Elevation',
  '## Components',
  "## Do's and Don'ts",
];

// ─── Required fields that must appear somewhere in DESIGN.md ────────
const REQUIRED_FIELDS = [
  {
    id: 'impeccable-gate',
    pattern: /npx impeccable skills install/,
    label: 'Impeccable setup gate',
    inject: {
      after: '## Overview',
      content: `\n### Setup gate\n\nBefore any UI implementation, run:\n\n\`\`\`bash\nnpx impeccable skills install\n\`\`\`\n\nThis gate is mandatory. Do not start frontend code until this command has been attempted.\n`,
    },
  },
  {
    id: 'creative-north-star',
    pattern: /Creative North Star|North Star/i,
    label: 'Creative North Star',
    inject: {
      after: '## Overview',
      content: `\n### Creative North Star\n\n> _Define the single visual thesis here. What should a user feel in 3 seconds? What makes this product's UI unmistakably its own?_\n\nExample: "Data-dense but never overwhelming — every pixel earns its place."\n`,
    },
  },
  {
    id: 'color-tokens',
    pattern: /--color-|color-primary|color-surface|semantic token/i,
    label: 'Semantic color tokens',
    inject: {
      after: '## Colors',
      content: `\n### Color roles (semantic tokens)\n\n| Token | Hex | Role |\n|-------|-----|------|\n| \`--color-primary\` | \`#1D4ED8\` | Primary actions, links, focus rings |\n| \`--color-primary-hover\` | \`#1E40AF\` | Primary button hover state |\n| \`--color-surface\` | \`#FFFFFF\` | Page and card background |\n| \`--color-surface-raised\` | \`#F8FAFC\` | Elevated surfaces |\n| \`--color-border\` | \`#E2E8F0\` | Default borders |\n| \`--color-text\` | \`#0F172A\` | Primary text (≥ 4.5:1 on surface) |\n| \`--color-text-muted\` | \`#475569\` | Secondary text (≥ 4.5:1 on surface) |\n| \`--color-error\` | \`#DC2626\` | Error state |\n| \`--color-success\` | \`#16A34A\` | Success state |\n| \`--color-warning\` | \`#D97706\` | Warning state |\n\nAll colors must use named tokens in implementation — no hardcoded hex values.\n`,
    },
  },
  {
    id: 'viewport-contract',
    pattern: /viewport.*contract|single-screen-fit|document-scroll|panel-scroll/i,
    label: 'Page Viewport Contract (Gate 18)',
    inject: {
      after: '## Overview',
      content: `\n### Page Viewport Contract\n\nEvery route must declare its scroll governance before CSS is written:\n\n| Route pattern | Viewport mode | Scroll owner |\n|--------------|--------------|-------------|\n| \`/login\`, \`/signup\`, \`/onboarding\` | \`single-screen-fit\` | No scroll at normal content size |\n| \`/dashboard\`, \`/inbox\`, \`/settings\` | \`panel-scroll\` | Panel/sidebar internal scroll |\n| \`/\`, \`/pricing\`, \`/docs\` | \`document-scroll\` | Document owns scroll |\n| \`/reports\`, \`/analytics\` | \`data-overflow-exception\` | Table scrolls horizontally in container |\n\n**Rule:** The agent must never use \`overflow: hidden\` on \`html\`, \`body\`, \`#root\`, or \`main\` to fix unwanted scroll. Fix the root cause instead.\n\n**Viewport units:** Use \`min-block-size: 100dvh\` with \`100vh\` fallback. Never use fixed \`height: 100vh\`.\n`,
    },
  },
  {
    id: 'modal-contract',
    pattern: /modal.*contract|focus.trap|scroll.lock.*modal/i,
    label: 'Modal Contract (Gate 19)',
    inject: {
      after: '## Components',
      content: `\n### Modal / Drawer contract\n\nEvery modal must declare before implementation:\n\n| Field | Required value |\n|-------|---------------|\n| Scroll owner | Dialog body (not document) |\n| Background | Inert — no interaction, no scroll |\n| Focus | Trapped inside dialog; restored to trigger on close |\n| Escape | Closes non-destructive modals |\n| Backdrop | \`rgba(0,0,0,0.48)\` with \`blur(8px)\` |\n| Max width | \`min(calc(100vw - 32px), 480px)\` |\n| Max height | \`calc(100dvh - 32px)\` |\n| Centering | Backdrop grid \`place-items: center\` + \`align-self: safe center\` |\n\n**Forbidden:** \`position:fixed; top:50%; left:50%; transform:translate(-50%,-50%)\` without \`max-block-size\` clamp.\n`,
    },
  },
  {
    id: 'z-index-tokens',
    pattern: /--z-|z-index.*token|z-sticky|z-modal/i,
    label: 'Z-index token scale (Gate 23)',
    inject: {
      after: '## Elevation',
      content: `\n### Z-index token scale\n\nAll overlays must use tokens from this scale. Magic numbers are forbidden.\n\n\`\`\`css\n:root {\n  --z-base:     0;\n  --z-raised:   10;    /* cards, elevated content */\n  --z-sticky:   100;   /* sticky headers, fixed sidebars */\n  --z-dropdown: 200;   /* dropdowns, popovers */\n  --z-tooltip:  300;   /* tooltips */\n  --z-modal:    400;   /* modals, drawers */\n  --z-toast:    500;   /* toast notifications */\n  --z-top:      9999;  /* critical overlays, blocking loaders */\n}\n\`\`\`\n`,
    },
  },
  {
    id: 'popup-strategy',
    pattern: /popup.*strategy|Strategy A|Strategy B|Strategy C|floating.*strategy|position-try-fallbacks|flip\(\)/i,
    label: 'Popup positioning strategy (Gate 23)',
    inject: {
      after: '## Components',
      content: `\n### Floating element positioning strategy\n\n**Selected strategy: B — Floating UI / Popper.js**\n\nAll floating elements (dropdowns, tooltips, popovers, date pickers, comboboxes) must use:\n\n\`\`\`javascript\ncomputePosition(triggerEl, floatingEl, {\n  placement: 'bottom-start',\n  middleware: [\n    flip(),                   // re-evaluates all quadrants\n    shift({ padding: 8 }),    // keeps popup 8px inside viewport\n    size({                    // caps height at available space\n      apply({ availableHeight, elements }) {\n        Object.assign(elements.floating.style, {\n          maxHeight: \`\${Math.min(availableHeight - 8, 320)}px\`,\n          overflowY: 'auto',\n        });\n      },\n    }),\n  ],\n});\n\`\`\`\n\nPortal mounting: all floating elements must use \`createPortal\` (React) or \`Teleport\` (Vue). No floating elements inside \`overflow: hidden\` parents.\n`,
    },
  },
  {
    id: 'typography-scale',
    pattern: /type.*scale|font-size.*display|--text-|font-display/i,
    label: 'Typography scale',
    inject: {
      after: '## Typography',
      content: `\n### Type scale\n\n| Role | Size | Weight | Line height | Use |\n|------|------|--------|-------------|-----|\n| Display | 36–48px | 700 | 1.1 | Hero headings |\n| Heading 1 | 28–32px | 700 | 1.2 | Page titles |\n| Heading 2 | 22–24px | 600 | 1.3 | Section headings |\n| Heading 3 | 18–20px | 600 | 1.4 | Subsections |\n| Body | 16px | 400 | 1.6 | Default text |\n| Body small | 14px | 400 | 1.5 | Supporting text |\n| Label | 12–13px | 500 | 1.4 | Form labels, badges |\n| Caption | 11–12px | 400 | 1.4 | Timestamps, footnotes |\n| Numeric | 14–20px | 600 | 1.2 | KPI values, metrics |\n\n**Rules:** Body text minimum 14px. Max text width 72ch. No body text on gradients without verified contrast.\n`,
    },
  },
  {
    id: 'overlay-system',
    pattern: /overlay.*system|Toast.*System|ToastViewport|centralized.*overlay/i,
    label: 'Overlay system declaration (Gate 21)',
    inject: {
      after: '## Components',
      content: `\n### Overlay system\n\nAll overlays (toast, tooltip, popover, dropdown, modal, tour) must be rendered through the centralized Overlay System. Manual \`position: fixed\` overlays inside page components are a Gate 21 blocker.\n\n**Toast rules:**\n- API only: \`toast.success()\`, \`toast.error()\`, \`toast.info()\` — never manual markup\n- Single \`<ToastViewport>\` at app root\n- Max visible: 1 mobile, 2 desktop — queued, not stacked\n- Min auto-dismiss: 5 seconds. Pause on hover/focus\n- Solid surface only — min 4.5:1 text contrast\n- Toast for low-risk success only. Inline for forms. Banner for page warnings. Modal for sensitive actions.\n`,
    },
  },
];

// ─── Section templates (fallback content when full section missing) ──
const SECTION_TEMPLATES = {
  '## Overview': `## Overview

> **Product:** _Project name here_
> **Design system baseline:** _e.g. Material Design_
> **Version:** 1.0 — generated by VDMA autopilot

### Setup gate

Before any UI implementation, run:

\`\`\`bash
npx impeccable skills install
\`\`\`

### Creative North Star

> _Define the single visual thesis here._

### 2026 Standards Gate

Standards verified: WCAG 2.2, MDN Baseline Widely Available, web.dev Core Web Vitals.
Date checked: ${new Date().toISOString().slice(0, 10)}.

`,
  '## Colors': `## Colors

### Color roles (semantic tokens)

| Token | Hex | Role |
|-------|-----|------|
| \`--color-primary\` | \`#1D4ED8\` | Primary actions, links, focus rings |
| \`--color-primary-hover\` | \`#1E40AF\` | Primary button hover |
| \`--color-surface\` | \`#FFFFFF\` | Page and card background |
| \`--color-surface-raised\` | \`#F8FAFC\` | Elevated surfaces |
| \`--color-border\` | \`#E2E8F0\` | Default borders |
| \`--color-text\` | \`#0F172A\` | Primary text |
| \`--color-text-muted\` | \`#475569\` | Secondary text |
| \`--color-error\` | \`#DC2626\` | Error state |
| \`--color-success\` | \`#16A34A\` | Success state |
| \`--color-warning\` | \`#D97706\` | Warning state |

**Contrast rules:** All text must meet WCAG AA (4.5:1 normal, 3:1 large). No hardcoded hex values in implementation — use tokens only.

`,
  '## Typography': `## Typography

### Type scale

| Role | Size | Weight | Line height |
|------|------|--------|-------------|
| Display | 36px | 700 | 1.1 |
| Heading 1 | 28px | 700 | 1.2 |
| Heading 2 | 22px | 600 | 1.3 |
| Body | 16px | 400 | 1.6 |
| Body small | 14px | 400 | 1.5 |
| Label | 12px | 500 | 1.4 |
| Caption | 11px | 400 | 1.4 |

**Rules:** Minimum 14px body. Max line width 72ch. No text on gradients without verified contrast.

`,
  '## Elevation': `## Elevation

### Shadow scale

| Token | Value | Use |
|-------|-------|-----|
| \`--shadow-sm\` | \`0 1px 2px rgba(0,0,0,0.05)\` | Subtle card lift |
| \`--shadow-md\` | \`0 4px 16px rgba(0,0,0,0.08)\` | Raised panels |
| \`--shadow-lg\` | \`0 8px 32px rgba(0,0,0,0.12)\` | Dropdowns |
| \`--shadow-xl\` | \`0 24px 80px rgba(0,0,0,0.20)\` | Modals |

### Z-index token scale

\`\`\`css
:root {
  --z-base:     0;
  --z-raised:   10;
  --z-sticky:   100;
  --z-dropdown: 200;
  --z-tooltip:  300;
  --z-modal:    400;
  --z-toast:    500;
  --z-top:      9999;
}
\`\`\`

`,
  '## Components': `## Components

_Component contracts are defined below. Each component must specify: purpose, anatomy, variants, states, spacing, radius, border, background, typography, motion, accessibility, and anti-patterns._

### Button

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | \`--color-primary\` | white | none |
| Secondary | transparent | \`--color-primary\` | \`--color-border\` |
| Destructive | \`#DC2626\` | white | none |
| Ghost | transparent | \`--color-text\` | none |

States: default, hover, focus (3px ring), disabled (0.5 opacity), loading (spinner).

`,
  "## Do's and Don'ts": `## Do's and Don'ts

### Do

- Use semantic HTML: \`<button>\`, \`<a>\`, \`<input>\`, \`<nav>\`, \`<main>\`
- Use design tokens for every color, spacing, radius, shadow, and z-index value
- Run \`npx impeccable skills install\` before UI implementation
- Declare the Page Viewport Contract for every route before writing CSS
- Implement the Modal Contract for every dialog (focus trap, scroll lock, backdrop)
- Use the centralized Overlay System for all toasts and floating elements
- Test at 320×568, 390×844, 768×720, 1280×720, 1440×900

### Don't

- Use \`overflow: hidden\` on \`html\`, \`body\`, \`#root\`, or \`main\` as a scroll fix
- Use \`height: 100vh\` on content-heavy containers (use \`min-block-size: 100dvh\` instead)
- Use \`alert()\`, \`confirm()\`, or \`prompt()\` for product flows
- Use hardcoded hex colors or magic z-index numbers
- Use clickable \`<div>\` or \`<span>\` elements instead of \`<button>\`
- Ship lorem ipsum, "John Doe", "example.com", or fake metrics to users
- Apply purple/blue gradients as brand identity
- Build toast markup manually inside page components
- Position modal cards with \`top: 50%; transform: translate(-50%, -50%)\` without height clamp

`,
};

// ─── Main repair function ─────────────────────────────────────────────
function repairDesignMd(designPath) {
  const repairs = [];
  const warnings = [];

  if (!existsSync(designPath)) {
    // Create a fresh DESIGN.md from section templates
    const content = Object.values(SECTION_TEMPLATES).join('\n');
    writeFileSync(designPath, `# DESIGN.md\n\n_Generated by VDMA autopilot on ${new Date().toISOString().slice(0, 10)}_\n\n${content}`);
    repairs.push({ id: 'created', label: 'Created DESIGN.md from template', type: 'create' });
    return { repairs, warnings };
  }

  let content = readFileSync(designPath, 'utf8');
  let modified = false;

  // 1. Check for missing required sections
  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(section)) {
      const template = SECTION_TEMPLATES[section] || `${section}\n\n_TODO: fill in this section_\n\n`;
      content = content + '\n\n' + template;
      modified = true;
      repairs.push({ id: `section-${section}`, label: `Added missing section: ${section}`, type: 'section' });
    }
  }

  // 2. Check for required fields and inject if missing
  for (const field of REQUIRED_FIELDS) {
    if (!field.pattern.test(content)) {
      const { after, content: injection } = field.inject;
      if (content.includes(after)) {
        const insertAt = content.indexOf(after) + after.length;
        const nextSection = content.indexOf('\n## ', insertAt);
        const injectionPoint = nextSection > -1 ? insertAt : content.length;
        content = content.slice(0, injectionPoint) + '\n' + injection + content.slice(injectionPoint);
      } else {
        content += '\n' + injection;
      }
      modified = true;
      repairs.push({ id: field.id, label: `Added: ${field.label}`, type: 'field' });
    }
  }

  if (modified) {
    writeFileSync(designPath, content);
  }

  return { repairs, warnings, modified };
}

// ─── PRODUCT.md bootstrap ─────────────────────────────────────────────
function bootstrapProductMd(productPath) {
  if (existsSync(productPath)) return null;

  const templatePath = join(ASSETS, 'PRODUCT.template.md');
  if (existsSync(templatePath)) {
    const template = readFileSync(templatePath, 'utf8');
    writeFileSync(productPath, template);
    return { id: 'product-created', label: 'Created PRODUCT.md from template', type: 'create' };
  }

  const minimal = `# PRODUCT.md

_Generated by VDMA autopilot on ${new Date().toISOString().slice(0, 10)}_

## Design system baseline

**Selected baseline:** custom-hybrid

**Baseline fit rationale:** _Describe why this baseline fits the product._

## Product

- **Name:** _Project name_
- **Category:** _e.g. SaaS dashboard, landing page, mobile app_
- **Core users:** _Who uses this?_
- **User situation:** _What are they doing when they open this?_
- **Primary job to be done:** _What must the product help them accomplish?_
- **Product promise:** _One sentence._

## Brand

- **Emotional register:** _e.g. calm and professional, energetic, trustworthy_
- **Brand traits:** _e.g. precise, minimal, warm_
- **What the product must never feel like:** _e.g. generic SaaS, corporate, cold_

## Constraints

- **Localization:** English (LTR)
- **Accessibility:** WCAG 2.2 AA
- **RTL:** Not required

## Anti-references

_Products whose visual style should be avoided._
`;
  writeFileSync(productPath, minimal);
  return { id: 'product-created-minimal', label: 'Created PRODUCT.md (minimal)', type: 'create' };
}

// ─── CLI entry point ──────────────────────────────────────────────────
const [,, designArg = 'DESIGN.md', productArg = 'PRODUCT.md'] = process.argv;
const designPath = resolve(process.cwd(), designArg);
const productPath = resolve(process.cwd(), productArg);

console.log(`\n${c.bold}${c.magenta}VDMA Auto-Repair Engine${c.reset}\n`);

// Bootstrap PRODUCT.md
const productRepair = bootstrapProductMd(productPath);
if (productRepair) {
  console.log(fix(productRepair.label));
} else {
  console.log(ok('PRODUCT.md exists'));
}

// Repair DESIGN.md
const { repairs, warnings, modified } = repairDesignMd(designPath);

if (repairs.length === 0) {
  console.log(ok('DESIGN.md — no repairs needed'));
} else {
  for (const r of repairs) {
    console.log(fix(r.label));
  }
}

if (warnings.length > 0) {
  for (const w of warnings) {
    console.log(`${c.yellow}  ⚠${c.reset} ${w}`);
  }
}

console.log(`\n${repairs.length + (productRepair ? 1 : 0)} repair(s) applied.\n`);

// Output machine-readable JSON for autopilot
const allRepairs = [...(productRepair ? [productRepair] : []), ...repairs];
process.stdout.write(`\nVDMA_REPAIR_JSON:${JSON.stringify({ repairs: allRepairs, warnings })}\n`);
