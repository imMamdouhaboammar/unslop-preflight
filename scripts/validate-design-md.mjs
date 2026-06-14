#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2] || 'DESIGN.md';
if (!fs.existsSync(file)) {
  console.error(`missing ${file}`);
  process.exit(1);
}

const md = fs.readFileSync(file, 'utf8');
const lower = md.toLowerCase();
const required = ['Overview', 'Colors', 'Typography', 'Elevation', 'Components', "Do's and Don'ts"];
const h2 = [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
const missing = required.filter((section) => !h2.includes(section));
const extra = h2.filter((section) => !required.includes(section));

let failures = [];

if (missing.length) failures.push(`missing sections: ${missing.join(', ')}`);
if (extra.length) failures.push(`extra top-level sections: ${extra.join(', ')}`);

const checks = [
  ['Creative North Star', /Creative North Star/i],
  ['Design System Baseline', /Design System Baseline|Selected baseline|atlassian|salesforce-lightning|shopify-polaris|material-design|apple-human-interface|custom-hybrid/i],
  ['baseline fit rationale', /Why this baseline fits|What to borrow|What not to copy|baseline.*fits|borrowed patterns/i],
  ['hex colors', /#[0-9a-fA-F]{6}\b/],
  ['component states', /States:/i],
  ['accessibility', /accessibility|contrast|keyboard|focus/i],
  ['motion', /motion|reduced motion|transition|prefers-reduced-motion/i],
  ['anti-patterns', /do not|don't|forbidden|avoid/i],
  ['contrast rules', /4\.5:1|3:1|contrast/i],
  ['icon system rules', /icon system|sparkle|emoji|magic wand|starburst/i],
  ['directionality rules', /rtl|ltr|directionality|text-align:\s*start|logical/i],
  ['UX-CRX rules', /ux-crx|primary action|secondary action|decision point|recovery path|progressive disclosure/i],
  ['responsive mobile rules', /responsive|mobile|viewport|320|360|390|414|tablet|touch target/i],
  ['in-app popup rules', /in-app|modal|drawer|toast|banner|inline validation|alert\(\)|confirm\(\)|prompt\(\)|native browser/i],
  ['Unslop setup command', /npx\s+unslop\s+skills\s+install/i],
  ['Unslop setup gate', /unslop setup|setup gate|installation gate|before implementation|before coding/i],
  ['Intake Session Gate', /Intake Session Gate|INTAKE\.session\.md|intake/i],
  ['2026 Standards Gate', /2026 Standards Gate|STANDARDS\.search-notes\.md|standards search|live standards/i],
  ['Rules Engine Gate', /Rules Engine Gate|run-gates\.mjs|rules engine/i],
  ['Standards topics', /WCAG 2\.2|W3C|MDN Baseline|Core Web Vitals|container queries|dialog/i],
  ['official design system docs', /Atlassian Design System|Lightning Design System|Salesforce|Polaris|Shopify|Material Design|Human Interface Guidelines|Apple/i],
];

for (const [label, pattern] of checks) {
  if (!pattern.test(md)) failures.push(`missing ${label}`);
}

if (/amplified|Amplify Mode|DESIGN\.amplification-report/i.test(md)) {
  if (!/DESIGN\.amplification-report\.md|amplification report/i.test(md)) failures.push('amplified file must reference DESIGN.amplification-report.md');
  if (!/old design|legacy|amplified from|preserve/i.test(md)) failures.push('amplified file must explain preservation and legacy handling');
}

const weakPhrases = [
  'modern and clean',
  'premium saas',
  'sleek and modern',
  'cutting-edge',
  'game-changing',
  'state-of-the-art',
  'unleash',
  'unlock the power',
  'seamless',
  'delve',
  'empower',
  'robust',
  'testament',
  'elevate',
  'transform',
  'innovative',
  'synergy',
  'leverage'
];

for (const phrase of weakPhrases) {
  if (lower.includes(phrase)) failures.push(`weak phrase found: ${phrase}`);
}

if (failures.length) {
  console.error('DESIGN.md validation failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('DESIGN.md validation passed');
