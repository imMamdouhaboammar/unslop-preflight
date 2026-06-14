#!/usr/bin/env node
import fs from 'node:fs';

const designFile = process.argv[2] || 'DESIGN.md';
const productFile = process.argv[3] || 'PRODUCT.md';

if (!fs.existsSync(designFile)) {
  console.error(`missing ${designFile}`);
  process.exit(1);
}

const design = fs.readFileSync(designFile, 'utf8');
const product = fs.existsSync(productFile) ? fs.readFileSync(productFile, 'utf8') : '';
const intake = fs.existsSync('INTAKE.session.md') ? fs.readFileSync('INTAKE.session.md', 'utf8') : '';
const standards = fs.existsSync('STANDARDS.search-notes.md') ? fs.readFileSync('STANDARDS.search-notes.md', 'utf8') : '';

const scoreItems = [
  ['Intake gate', 8, /Intake Session Gate|INTAKE\.session\.md|intake/i.test(design) && /core user|main job|assumptions/i.test(intake + design)],
  ['2026 standards gate', 8, /2026 Standards Gate|standards search|STANDARDS\.search-notes\.md/i.test(design) && /WCAG 2\.2|W3C|MDN|web\.dev|Core Web Vitals|Baseline/i.test(design + standards)],
  ['Rules engine gate', 8, /Rules Engine Gate|run-gates\.mjs|rules engine/i.test(design)],
  ['Design system baseline gate', 6, /Design System Baseline|Selected baseline|atlassian|salesforce-lightning|shopify-polaris|material-design|apple-human-interface|custom-hybrid/i.test(design + intake + product) && /Atlassian Design System|Lightning Design System|Salesforce|Polaris|Shopify|Material Design|Human Interface Guidelines|Apple|custom|hybrid/i.test(design + standards + intake)],
  ['Product specificity', 10, /Creative North Star|visual thesis|user|product|workflow/i.test(design) && product.length > 300],
  ['Visual point of view', 8, /Creative North Star/i.test(design) && /Visual thesis/i.test(design)],
  ['System completeness', 12, /## Overview[\s\S]*## Colors[\s\S]*## Typography[\s\S]*## Elevation[\s\S]*## Components[\s\S]*## Do's and Don'ts/i.test(design)],
  ['Anti-slop strength', 10, /gradient|glass|generic|forbidden|avoid|do not|don't|sparkle|emoji|native browser/i.test(design)],
  ['Accessibility and localization', 10, /contrast|keyboard|focus|reduced motion|rtl|ltr|arabic|localization|directionality|4\.5:1|3:1/i.test(design)],
  ['Responsive and mobile quality', 8, /responsive|mobile|viewport|320|360|390|414|tablet|touch target|container quer/i.test(design)],
  ['Component usefulness', 7, /Purpose:|Anatomy:|Variants:|States:|Accessibility:/i.test(design)],
  ['Agent readiness', 5, /implementation guardrails|before coding|DESIGN\.md|PRODUCT\.md|alert\(\)|confirm\(\)|prompt\(\)|in-app/i.test(design) && /npx\s+unslop\s+skills\s+install/i.test(design)],
];

let total = 0;
const rows = [];

for (const [name, points, passed] of scoreItems) {
  const value = passed ? points : 0;
  total += value;
  rows.push({ name, points: value, max: points, passed });
}

console.table(rows);
console.log(`score: ${total}/100`);

if (total < 85) {
  console.error('score below pass bar: revise before implementation');
  process.exit(1);
}
