#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = process.cwd();

const resolveProjectPath = (value) => path.isAbsolute(value) ? value : path.join(PROJECT_ROOT, value);
const resolveSkillScript = (name) => path.join(SKILL_ROOT, 'scripts', name);

const designFile = resolveProjectPath(process.argv[2] || 'DESIGN.md');
const productFile = resolveProjectPath(process.argv[3] || 'PRODUCT.md');
const srcDir = resolveProjectPath(process.argv[4] || 'src');
const intakeFile = path.join(PROJECT_ROOT, 'INTAKE.session.md');
const standardsFile = path.join(PROJECT_ROOT, 'STANDARDS.search-notes.md');

const failures = [];
const warnings = [];

function exists(file) { return fs.existsSync(file); }
function read(file) { return exists(file) ? fs.readFileSync(file, 'utf8') : ''; }
function check(label, condition, level = 'blocker') {
  if (!condition) (level === 'blocker' ? failures : warnings).push(label);
}

const design = read(designFile);
const product = read(productFile);
const intake = read(intakeFile);
const standards = read(standardsFile);
const all = `${design}\n${product}\n${intake}\n${standards}`.toLowerCase();

check('missing INTAKE.session.md', exists(intakeFile));
check('intake missing design system baseline', /Design System Baseline|Selected baseline|atlassian|salesforce-lightning|shopify-polaris|material-design|apple-human-interface|custom-hybrid/i.test(intake));
check('intake missing core user', /core user:/i.test(intake));
check('intake missing main job', /main job|job to be done/i.test(intake));
check('missing PRODUCT.md', exists(productFile));
check('PRODUCT.md missing design system baseline', /Design System Baseline|Selected baseline|atlassian|salesforce-lightning|shopify-polaris|material-design|apple-human-interface|custom-hybrid/i.test(product));
check('PRODUCT.md missing success criteria', /success criteria/i.test(product));
check('missing DESIGN.md target', exists(designFile));
check('DESIGN.md missing Impeccable install command', /npx\s+impeccable\s+skills\s+install/i.test(design));
check('DESIGN.md missing 2026 Standards Gate', /2026 Standards Gate/i.test(design));
check('DESIGN.md missing Intake Session Gate', /Intake Session Gate/i.test(design));
check('DESIGN.md missing Rules Engine Gate', /Rules Engine Gate/i.test(design));
check('DESIGN.md missing Design System Baseline', /Design System Baseline|Selected baseline|atlassian|salesforce-lightning|shopify-polaris|material-design|apple-human-interface|custom-hybrid/i.test(design));
check('DESIGN.md missing baseline fit rationale', /Why this baseline fits|What to borrow|What not to copy|borrowed patterns/i.test(design));
check('missing STANDARDS.search-notes.md', exists(standardsFile));
check('standards notes missing selected design system docs', /Atlassian Design System|Lightning Design System|Salesforce|Polaris|Shopify|Material Design|Human Interface Guidelines|Apple|Selected Design System Baseline/i.test(standards));
check('missing contrast rules', /4\.5:1|contrast/i.test(design));
check('missing directionality rules', /rtl|ltr|directionality|text-align:\s*start|logical/i.test(design));
check('missing responsive rules', /responsive|mobile|viewport|container quer|320|360|390|414/i.test(design));
check('missing popup system rules', /alert\(\)|confirm\(\)|prompt\(\)|modal|drawer|toast|inline validation/i.test(design));
check('missing UX-CRX rules', /ux-crx|primary action|secondary action|decision point|recovery path/i.test(design));
check('missing icon system rules', /sparkle|magic wand|emoji|icon system|starburst/i.test(design));

check('Gate 14: DESIGN.md missing semantic HTML / button-vs-div rule', /semantic html|<button>|button>.*<a|div onclick|real button|element is a `?<button/i.test(design));
check('Gate 14: DESIGN.md missing keyboard operability rule', /keyboard|focus-visible|tabindex|onkeydown|enter\/space|operable by keyboard/i.test(design));
check('Gate 15: DESIGN.md missing realistic-content rule (no placeholder slop)', /realistic (content|data|example)|no placeholder|lorem ipsum|fake data|placeholder.*never/i.test(design));
check('Gate 16: DESIGN.md missing design-token rule (no hardcoded values)', /token|do not invent tokens|no undocumented|hardcoded/i.test(design));
check('Gate 17: implementation prompt should name DESIGN.md as single source of truth', /single source of truth|do not invent tokens|re-run.*gates|source of truth/i.test(all));

const validateScript = resolveSkillScript('validate-design-md.mjs');
if (exists(validateScript) && exists(designFile)) {
  const res = spawnSync(process.execPath, [validateScript, designFile], { encoding: 'utf8', cwd: PROJECT_ROOT });
  if (res.status !== 0) failures.push(`validate-design-md failed:\n${res.stderr || res.stdout}`);
}

const scoreScript = resolveSkillScript('score-design-md.mjs');
if (exists(scoreScript) && exists(designFile)) {
  const res = spawnSync(process.execPath, [scoreScript, designFile, productFile], { encoding: 'utf8', cwd: PROJECT_ROOT });
  if (res.status !== 0) failures.push(`score-design-md failed:\n${res.stderr || res.stdout}`);
}

const scanUiScript = resolveSkillScript('scan-ui-implementation.mjs');
if (exists(scanUiScript) && exists(srcDir)) {
  const res = spawnSync(process.execPath, [scanUiScript, srcDir], { encoding: 'utf8', cwd: PROJECT_ROOT });
  if (res.status !== 0) failures.push(`scan-ui-implementation failed:\n${res.stderr || res.stdout}`);
}

const scanA11yScript = resolveSkillScript('scan-accessibility.mjs');
if (exists(scanA11yScript) && exists(srcDir)) {
  const res = spawnSync(process.execPath, [scanA11yScript, srcDir], { encoding: 'utf8', cwd: PROJECT_ROOT });
  if (res.status !== 0) failures.push(`scan-accessibility failed:\n${res.stderr || res.stdout}`);
}

if (warnings.length) {
  console.warn('Gate warnings');
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (failures.length) {
  console.error('Rules engine gates failed');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Rules engine gates passed');
