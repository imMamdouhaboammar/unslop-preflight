#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const designFile = process.argv[2] || 'DESIGN.md';
const productFile = process.argv[3] || 'PRODUCT.md';
const targetFile = process.argv[4] || 'DESIGN.amplified.md';
const reportFile = process.argv[5] || 'DESIGN.amplification-report.md';

if (!fs.existsSync(designFile)) {
  console.error(`missing old design file: ${designFile}`);
  process.exit(1);
}

const oldDesign = fs.readFileSync(designFile, 'utf8');
const lower = oldDesign.toLowerCase();
const h2 = [...oldDesign.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());

const requiredSections = ['Overview', 'Colors', 'Typography', 'Elevation', 'Components', "Do's and Don'ts"];
const missingSections = requiredSections.filter((section) => !h2.includes(section));
const extraSections = h2.filter((section) => !requiredSections.includes(section));

const checks = [
  ['Missing Design System Baseline', !/Design System Baseline|Selected baseline|atlassian|salesforce-lightning|shopify-polaris|material-design|apple-human-interface|custom-hybrid|Atlassian Design System|Lightning Design System|Polaris|Material Design|Human Interface Guidelines/i.test(oldDesign)],
  ['Missing Intake Session Gate', !/Intake Session Gate|INTAKE\.session\.md|intake/i.test(oldDesign)],
  ['Missing 2026 Standards Gate', !/2026 Standards Gate|STANDARDS\.search-notes\.md|standards search/i.test(oldDesign)],
  ['Missing Rules Engine Gate', !/Rules Engine Gate|run-gates\.mjs|rules engine/i.test(oldDesign)],
  ['Missing Impeccable setup gate', !/npx\s+impeccable\s+skills\s+install/i.test(oldDesign)],
  ['Missing Creative North Star', !/Creative North Star/i.test(oldDesign)],
  ['Missing contrast rules', !/contrast|4\.5:1|3:1/i.test(oldDesign)],
  ['Missing RTL/LTR directionality rules', !/rtl|ltr|directionality|dir=|text-align:\s*start|logical/i.test(oldDesign)],
  ['Missing responsive mobile rules', !/responsive|mobile|viewport|320|360|390|414|tablet|touch target/i.test(oldDesign)],
  ['Missing UX-CRX logic', !/ux-crx|primary action|secondary action|decision point|recovery path|progressive disclosure/i.test(oldDesign)],
  ['Missing in-app popup rules', !/in-app|modal|drawer|toast|banner|inline validation|alert\(\)|confirm\(\)|prompt\(\)|native browser/i.test(oldDesign)],
  ['Missing icon system rules', !/icon system|sparkle|emoji|magic wand|starburst/i.test(oldDesign)],
  ['Missing component states', !/States:/i.test(oldDesign)],
  ['Missing accessibility rules', !/accessibility|keyboard|focus|reduced motion/i.test(oldDesign)],
];

const aiPatterns = [
  ['Purple or blue gradient defaults', /(purple|violet|indigo|blue).*gradient|gradient.*(purple|violet|indigo|blue)/i.test(oldDesign)],
  ['Gradient text', /gradient text|background-clip:\s*text|text-transparent/i.test(oldDesign)],
  ['Sparkle or magic icon language', /sparkle|sparkles|magic wand|starburst|glitter/i.test(oldDesign)],
  ['Emoji UI usage', /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(oldDesign)],
  ['Native popup usage', /alert\(|confirm\(|prompt\(/i.test(oldDesign)],
  ['Generic weak phrases', /modern and clean|premium saas|sleek and modern|cutting-edge|game-changing|state-of-the-art|unleash|unlock the power/i.test(lower)],
];

const foundIssues = [
  ...missingSections.map((section) => `Missing required section: ${section}`),
  ...extraSections.map((section) => `Extra top-level section that must be folded into the six-section contract: ${section}`),
  ...checks.filter(([, failed]) => failed).map(([label]) => label),
  ...aiPatterns.filter(([, found]) => found).map(([label]) => label),
];

const preserveHints = [];
for (const match of oldDesign.matchAll(/#\s+(.+)|Creative North Star:?\s*(.+)|#[0-9a-fA-F]{6}\b/g)) {
  preserveHints.push(match[0]);
  if (preserveHints.length >= 20) break;
}

const preserved = preserveHints.length
  ? preserveHints.map((item) => `- ${item.replace(/\n/g, ' ')}`).join('\n')
  : '- Preserve only project-specific decisions after manual review.';
const criticalIssues = foundIssues.length
  ? foundIssues.map((item) => `- ${item}`).join('\n')
  : '- No critical issue detected by the heuristic scanner. Claude must still perform a manual audit.';
const aiRemoved = aiPatterns.filter(([, found]) => found).map(([label]) => `- ${label}`).join('\n') || '- Pending manual review.';

const report = `# DESIGN.md Amplification Report

## Summary

- Mode: amplify
- Source file: ${designFile}
- Target file: ${targetFile}
- Product file: ${fs.existsSync(productFile) ? productFile : 'missing'}
- Design System Baseline gate required: yes
- Intake gate required: yes
- Standards search gate required: yes
- Rules engine required: yes
- Impeccable setup required: yes
- Validation status: pending after Claude rewrite

## Design system baseline

- Selected baseline: pending. Claude must extract it from the old file or ask it as the first intake question.
- Options: Atlassian Design System, Lightning Design System (Salesforce), Polaris (Shopify), Material Design, Human Interface Guidelines (Apple), or Custom / hybrid.

## What was preserved

${preserved}

## Critical issues found

${criticalIssues}

## AI-looking patterns removed

${aiRemoved}

## Accessibility fixes

- Add explicit contrast, focus, keyboard, reduced motion, and non-text contrast rules.

## Directionality and localization fixes

- Add full RTL/LTR alignment rules using document direction and logical CSS properties.

## Responsive and mobile fixes

- Add viewport behavior for small mobile, common mobile, tablet, laptop, and wide desktop.

## Component system fixes

- Convert components into contracts with purpose, anatomy, variants, states, and accessibility.

## Intake gate status

The agent must complete or update \`INTAKE.session.md\` before final amplification.

## Standards search gate status

The agent must complete or update \`STANDARDS.search-notes.md\` before final amplification when web access exists.

## Rules engine status

Run before implementation:

\`\`\`bash
node scripts/run-gates.mjs ${targetFile} PRODUCT.md src
\`\`\`

## Impeccable setup status

The coding agent must run this command from the project root before implementation:

\`\`\`bash
npx impeccable skills install
\`\`\`

## Remaining assumptions

- Claude must infer missing product context from PRODUCT.md or the old design file if the user provides no brief.

## Validation checklist

- [ ] Design System Baseline exists and was handled as the first intake decision
- [ ] Intake Session Gate exists
- [ ] 2026 Standards Gate exists
- [ ] Rules Engine Gate exists
- [ ] Six top-level sections only
- [ ] Creative North Star exists
- [ ] Impeccable setup gate exists
- [ ] Contrast rules exist
- [ ] Icon system rules exist
- [ ] RTL/LTR directionality rules exist
- [ ] UX-CRX logic exists
- [ ] Responsive mobile rules exist
- [ ] In-app popup rules exist
- [ ] Component contracts exist
- [ ] Anti-patterns are explicit
`;

const scaffold = `# DESIGN.md

> Amplified from: ${path.basename(designFile)}
> This scaffold must be completed by Claude using vibe-design-md-architect, references/amplify-workflow.md, and the old design file.

## Overview

### Intake Session Gate

Before this amplified file is used, the agent must complete \`INTAKE.session.md\`, extract all inferable context, and document assumptions.

### 2026 Standards Gate

Before implementation, the agent must complete \`STANDARDS.search-notes.md\` using live official sources when web access exists. If live search is unavailable, mark bundled-references-only.

### Rules Engine Gate

Before implementation, run:

\`\`\`bash
node scripts/validate-design-md.mjs ${targetFile}
node scripts/score-design-md.mjs ${targetFile} PRODUCT.md
node scripts/run-gates.mjs ${targetFile} PRODUCT.md src
\`\`\`

### Impeccable setup gate

Before implementation, the coding agent must run this command from the project root when shell access exists:

\`\`\`bash
npx impeccable skills install
\`\`\`

If the command has already been run, confirm it. If it cannot run, document the failure reason and continue using this file as the source of truth. UI implementation must not start before this setup gate is attempted.

### Creative North Star

[Claude: write a product-specific Creative North Star. Do not use generic phrases.]

### Visual thesis

[Claude: preserve strong decisions from the old file and replace weak defaults.]

### Amplify Mode rule

The coding agent must read DESIGN.amplification-report.md and must not reintroduce removed AI-looking patterns, weak contrast, bad directionality, generic gradients, emoji icons, sparkle icons, unmanaged stacking, poor mobile behavior, or native browser popups.

## Colors

[Claude: convert old colors into semantic tokens with hex values, contrast targets, usage rules, and forbidden combinations.]

## Typography

[Claude: define display, heading, body, label, caption, numeric, Arabic/English, RTL/LTR, line height, text width, and responsive type rules.]

## Elevation

[Claude: define surface, border, shadow, overlay, modal, drawer, toast, focus, hover, active, disabled, and motion behavior.]

## Components

[Claude: define Button, Input, Select, Textarea, Checkbox, Radio, Card, Navigation, Sidebar, Modal/Drawer, Toast/Alert, Table/Data List, Empty State, Loading State, Form Validation, and product-specific components. Each must include Purpose, Anatomy, Variants, States, Accessibility, and What not to do.]

## Do's and Don'ts

[Claude: write strict implementation guardrails and non-negotiable bans based on the old file audit and this skill.]
`;

fs.writeFileSync(reportFile, report);
fs.writeFileSync(targetFile, scaffold);

console.log(`created ${reportFile}`);
console.log(`created ${targetFile}`);
console.log('Claude must now complete the amplified DESIGN.md using the old file and the skill rules.');
