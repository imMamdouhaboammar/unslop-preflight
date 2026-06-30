import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const cli = new URL('../bin/cli.js', import.meta.url).pathname;

function temp() {
  return mkdtempSync(join(tmpdir(), 'unslop-'));
}

function run(args, cwd = temp()) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}

test('help works', () => {
  const r = run(['--help']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Commands/);
});

test('version works', () => {
  const r = run(['--version']);
  assert.equal(r.status, 0);
  assert.match(r.stdout.trim(), /\d+\.\d+\.\d+/);
});

test('init creates missing files', () => {
  const cwd = temp();
  const r = run(['init'], cwd);
  assert.equal(r.status, 0);
  assert.ok(existsSync(join(cwd, 'PRODUCT.md')));
  assert.ok(existsSync(join(cwd, 'DESIGN.md')));
  assert.ok(existsSync(join(cwd, 'AGENTS.md')));
});

test('dry-run does not write files', () => {
  const cwd = temp();
  const r = run(['init', '--dry-run'], cwd);
  assert.equal(r.status, 0);
  assert.equal(existsSync(join(cwd, 'PRODUCT.md')), false);
});

test('autopilot writes reports', () => {
  const cwd = temp();
  const r = run(['autopilot', '--report'], cwd);
  assert.ok(existsSync(join(cwd, '.unslop/report.json')));
});

test('json report is valid', () => {
  const cwd = temp();
  const r = run(['audit', '--json'], cwd);
  assert.equal(r.status, 0);
  assert.doesNotThrow(() => JSON.parse(r.stdout));
});

test('ci exits non-zero on errors', () => {
  const cwd = temp();
  const r = run(['audit', '--ci'], cwd);
  assert.notEqual(r.status, 0);
});

test('security rule catches unmasked key wording', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nShow API key in table.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'api-key-masking'));
});

test('accessibility rule catches modal without focus trap', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nUse a modal for login.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'modal-without-focus-trap'));
});

test('responsive rule catches height 100vh', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nUse height: 100vh on auth page.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'height-100vh-mobile-risk'));
});

test('accessibility rule catches missing deterministic math', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nMake contrast WCAG AA.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'deterministic-contrast-math'));
});

test('responsive rule catches missing deterministic mobile tokens', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nMake mobile layout good.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'deterministic-mobile-behavior'));
});

test('states rule catches generic loading without tokens', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nAdd loading state.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'deterministic-interaction-states'));
});

test('focus rule catches generic focus without tokens', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nMake focus visible.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'deterministic-focus-management'));
});

test('anti-ai-slop rule catches sparkle icons', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nUse a sparkle icon here.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'no-sparkle-icons'));
});

test('anti-ai-slop rule catches brain icons', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nAdd a 🧠 brain icon for AI.');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'no-brain-icons'));
});

test('anti-ai-slop rule catches emojis', () => {
  const cwd = temp();
  run(['init'], cwd);
  writeFileSync(join(cwd, 'DESIGN.md'), '# DESIGN.md\nMake it look happy 😊');
  const data = JSON.parse(run(['audit', '--json'], cwd).stdout);
  assert.ok(data.issues.some((i) => i.id === 'no-emojis'));
});

test('doctor works and finds package.json missing', () => {
  const cwd = temp();
  const r = run(['doctor'], cwd);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /package.json not found/i);
});

test('agent-prompt flag outputs prompt', () => {
  const cwd = temp();
  const r = run(['audit', '--agent-prompt'], cwd);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /You are an expert AI frontend engineer/i);
});
