import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { listStandardsPacks } from '../src/core/standardsPacks.js';

const cli = new URL('../bin/cli.js', import.meta.url).pathname;

function temp() {
  return mkdtempSync(join(tmpdir(), 'unslop-maintainability-'));
}

function run(args, cwd = temp()) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}

function writeBaselineDocs(cwd) {
  writeFileSync(join(cwd, 'PRODUCT.md'), '# Product\n\nExisting product brief.\n', 'utf8');
  writeFileSync(join(cwd, 'DESIGN.md'), '# Design\n\nExisting design brief.\n', 'utf8');
  writeFileSync(join(cwd, 'AGENTS.md'), '# Agents\n\nExisting agent notes.\n', 'utf8');
}

test('README command validations', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url).pathname, 'utf8');
  assert.match(readme, /npx unslop-preflight autopilot/);
  assert.doesNotMatch(readme, /unslop-preflight autopilot[\s\S]*npx unslop autopilot/);
});

test('CLI help contains required commands and subcommands', () => {
  const r = run(['--help']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /scan/);
  assert.match(r.stdout, /standards/);
  assert.match(r.stdout, /standards list/);
  assert.match(r.stdout, /standards inspect <pack-id>/);
  assert.match(r.stdout, /npx unslop-preflight scan src/);
  assert.match(r.stdout, /npx unslop-preflight autopilot --report --strict/);
  assert.doesNotMatch(r.stdout, /npx unslop autopilot/);
});

test('standards list CLI works', () => {
  const r = run(['standards', 'list', '--no-color']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Unslop Standards Packs/);
  assert.match(r.stdout, /vibe-coding - Vibe Coding Standards Pack/);
});

test('standards inspect vibe-coding CLI works', () => {
  const r = run(['standards', 'inspect', 'vibe-coding', '--no-color']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Standards Pack: Vibe Coding Standards Pack \(vibe-coding\)/);
  assert.match(r.stdout, /Category: ARCHITECTURE/);
});

test('corrupt standards pack manifest warning test', () => {
  const packDir = join(new URL('../references/standards-packs', import.meta.url).pathname, '__temp_corrupt__');
  mkdirSync(packDir, { recursive: true });
  writeFileSync(join(packDir, 'manifest.json'), '{ malformed json: true ', 'utf8');

  try {
    const packs = listStandardsPacks();
    assert.ok(packs.warnings && packs.warnings.length > 0);
    assert.ok(packs.warnings.some(w => w.includes('Failed to parse manifest for standards pack "__temp_corrupt__"')));

    const r = run(['standards', 'list', '--no-color']);
    assert.match(r.stderr, /Warnings:/);
    assert.match(r.stderr, /Failed to parse manifest for standards pack "__temp_corrupt__"/);

    const rJson = run(['standards', 'list', '--json']);
    const parsed = JSON.parse(rJson.stdout);
    assert.ok(parsed.warnings && parsed.warnings.length > 0);
  } finally {
    rmSync(packDir, { recursive: true, force: true });
  }
});

test('scan src with standards works', () => {
  const cwd = temp();
  const src = join(cwd, 'src');
  mkdirSync(src, { recursive: true });
  // write a file violating vibe-coding (contains ts-ignore)
  writeFileSync(join(src, 'Component.js'), '// @ts-ignore\nconst x = 5;', 'utf8');

  const r = run(['scan', 'src', '--standards=vibe-coding'], cwd);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /no-ts-ignore/);
});

test('autopilot with standards works', () => {
  const cwd = temp();
  writeBaselineDocs(cwd);
  const src = join(cwd, 'src');
  mkdirSync(src, { recursive: true });
  writeFileSync(join(src, 'Component.js'), '// @ts-ignore\nconst x = 5;', 'utf8');

  const r = run(['autopilot', '--report', '--standards=vibe-coding'], cwd);
  assert.ok(r.status === 0 || r.status === 1);

  const reportPath = join(cwd, '.unslop', 'report.json');
  assert.ok(existsSync(reportPath));
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  assert.strictEqual(report.selectedStandards, 'vibe-coding');
  assert.ok(report.issues.some(i => i.id === 'no-ts-ignore'));
});

test('audit with standards merges findings', () => {
  const cwd = temp();
  writeBaselineDocs(cwd);
  const src = join(cwd, 'src');
  mkdirSync(src, { recursive: true });
  writeFileSync(join(src, 'Component.js'), '// @ts-ignore\nconst x = 5;', 'utf8');

  const r = run(['audit', '--standards=vibe-coding', '--json'], cwd);
  assert.ok(r.status === 0 || r.status === 1);

  const report = JSON.parse(r.stdout);
  assert.strictEqual(report.selectedStandards, 'vibe-coding');
  assert.ok(report.issues.some(i => i.id === 'no-ts-ignore'));
});

test('unknown standards pack fails clearly', () => {
  const cwd = temp();
  writeBaselineDocs(cwd);
  const r = run(['audit', '--standards=unknown'], cwd);
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Standards pack "unknown" not found/);
});
