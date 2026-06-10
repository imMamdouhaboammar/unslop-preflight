#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const out = 'STANDARDS.search-notes.md';
const productFile = process.argv[2] || 'PRODUCT.md';
const designFile = process.argv[3] || 'DESIGN.md';

if (fs.existsSync(out)) {
  console.log(`${out} already exists, skipping.`);
  process.exit(0);
}

const now = new Date().toISOString().slice(0, 10);
const product = fs.existsSync(productFile) ? fs.readFileSync(productFile, 'utf8') : '';
const design = fs.existsSync(designFile) ? fs.readFileSync(designFile, 'utf8') : '';
const stackHints = [...new Set([...product.matchAll(/\b(next\.js|react|vite|tailwind|shadcn|vue|nuxt|svelte|astro|remix|angular)\b/gi), ...design.matchAll(/\b(next\.js|react|vite|tailwind|shadcn|vue|nuxt|svelte|astro|remix|angular)\b/gi)].map(m => m[1].toLowerCase()))];
const stackLine = stackHints.length ? stackHints.join(', ') : '[unknown stack, search framework docs after stack is known]';
const content = `# STANDARDS.search-notes.md\n\n## Date Checked\n\n${now}\n\n## Search Status\n\n[pending-live-web-verification]\n\n## Required Search Queries\n\nRun these searches before finalizing DESIGN.md when web access exists:\n\n1. Claude Skills custom skill SKILL.md scripts resources official docs\n2. Impeccable npx impeccable skills install official docs\n3. WCAG 2.2 contrast focus target size reflow keyboard official W3C\n4. W3C Arabic RTL HTML dir attribute internationalization\n5. MDN Baseline web platform features compatibility\n6. web.dev responsive design container queries Core Web Vitals INP LCP CLS\n7. MDN dialog element showModal modal non-modal accessibility\n8. Official framework docs for: ${stackLine}
9. Official documentation for the selected design system baseline from INTAKE.session.md or PRODUCT.md
10. Atlassian Design System foundations components official docs
11. Salesforce Lightning Design System guidelines components official docs
12. Shopify Polaris design system web components official docs
13. Material Design 3 components theming accessibility official docs
14. Apple Human Interface Guidelines official docs\n\n## Sources To Prefer\n\n- Anthropic or Claude official docs for Skills\n- Impeccable official docs\n- W3C WCAG and Internationalization docs\n- MDN Web Docs\n- web.dev and Google Search Central for performance and Core Web Vitals\n- Official docs for the project framework and UI libraries
- Official docs for the selected design system baseline: Atlassian, Salesforce Lightning, Shopify Polaris, Material Design, or Apple Human Interface Guidelines\n\n## Selected Design System Baseline

- Baseline: [atlassian | salesforce-lightning | shopify-polaris | material-design | apple-human-interface | custom-hybrid]
- Official docs checked: [fill after search]
- Borrowed patterns: [fill after search]
- Patterns intentionally not copied: [fill after search]

## Standards Adopted Into DESIGN.md\n\n- [fill after search]\n\n## Standards Deferred\n\n- [fill after search]\n\n## Gate Result\n\n- Status: [pending | pass | pass-with-stale-risk | blocked]\n- Reason: [fill after search]\n`;
fs.writeFileSync(out, content);
console.log(`created ${out}`);
console.log('Claude must perform live standards search when web access exists, then update this file.');
