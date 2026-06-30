import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runAutopilotPipeline } from '../src/core/autopilotPlan.js';
import { applyRepairs } from '../src/core/repair.js';
import { Evidence } from '../src/core/findings.js';
import { runSourceScanners } from '../src/core/sourceScanner.js';

function tempProject() {
  return mkdtempSync(join(tmpdir(), 'unslop-autopilot-'));
}

function writeBaselineDocs(cwd) {
  writeFileSync(join(cwd, 'PRODUCT.md'), '# Product\n\nExisting product brief.\n', 'utf8');
  writeFileSync(join(cwd, 'DESIGN.md'), '# Design\n\nExisting design brief.\n', 'utf8');
  writeFileSync(join(cwd, 'AGENTS.md'), '# Agents\n\nExisting agent notes.\n', 'utf8');
}

test('README documents the package npx command clearly', () => {
  const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

  assert.match(readme, /npx unslop-preflight autopilot/);
  assert.match(readme, /package name is `unslop-preflight`/i);
});

test('max-passes=1 records exactly one autopilot pass', () => {
  const cwd = tempProject();
  writeBaselineDocs(cwd);

  const result = runAutopilotPipeline(cwd, { noSourceScan: true, maxPasses: '1' });

  assert.equal(result.passes.length, 1);
  assert.equal(result.passes[0].pass, 1);
  assert.ok(result.stopReason);
});

test('max-passes=2 records pass history and can continue after safe repairs', () => {
  const cwd = tempProject();
  writeBaselineDocs(cwd);

  const result = runAutopilotPipeline(cwd, { noSourceScan: true, maxPasses: '2' });

  assert.ok(result.passes.length >= 1);
  assert.ok(result.passes.length <= 2);
  assert.equal(result.passes[0].pass, 1);
  assert.ok('beforeScore' in result.passes[0]);
  assert.ok('afterScore' in result.passes[0]);
});

test('scanner failures are collected instead of swallowed', () => {
  const cwd = tempProject();
  const badTarget = join(cwd, 'src');
  writeFileSync(badTarget, 'not a directory', 'utf8');

  const findings = runSourceScanners(cwd, { srcDirs: ['src'] });
  const failures = findings.metadata.scannerResults.filter((result) => result.status === 'failed');

  assert.equal(findings.metadata.scanStats.scannerFailures, failures.length);
  assert.ok(failures.length > 0);
  assert.match(failures[0].error, /ENOTDIR|not a directory/i);
});

test('autopilot report includes scanStats and scanner failures', () => {
  const cwd = tempProject();
  writeBaselineDocs(cwd);
  writeFileSync(join(cwd, 'src'), 'not a directory', 'utf8');

  const result = runAutopilotPipeline(cwd, { strict: true, maxPasses: '1' });
  const reportJson = JSON.parse(readFileSync(join(cwd, '.unslop', 'report.json'), 'utf8'));
  const reportMd = readFileSync(join(cwd, '.unslop', 'report.md'), 'utf8');

  assert.ok(result.scanStats.scannerFailures > 0);
  assert.ok(reportJson.scanStats);
  assert.ok(reportJson.scanStats.scannerFailures > 0);
  assert.match(reportMd, /Source Scan Stats/);
  assert.match(reportMd, /Scanner Failures/);
});

test('markdown repair appends with blank-line block separation', () => {
  const cwd = tempProject();
  writeBaselineDocs(cwd);

  applyRepairs(cwd, {
    safeDocs: [new Evidence({
      ruleName: 'missing-target-users',
      symptom: 'Missing target users',
      type: 'spec'
    })]
  });

  const product = readFileSync(join(cwd, 'PRODUCT.md'), 'utf8');
  assert.match(product, /Existing product brief\.\n\n<!-- unslop:start missing-target-users -->/);
  assert.doesNotMatch(product, /brief\.<!-- unslop:start/);
});

test('apply-code-fixes records that source patching is not implemented', () => {
  const cwd = tempProject();
  writeBaselineDocs(cwd);

  const result = runAutopilotPipeline(cwd, {
    noSourceScan: true,
    maxPasses: '1',
    applyCodeFixes: true
  });

  assert.equal(result.codeFixes.requested, true);
  assert.equal(result.codeFixes.applied, false);
  assert.equal(result.codeFixes.reason, 'not-implemented');
});

test('strict mode treats scanner failures as blocking evidence', () => {
  const cwd = tempProject();
  writeBaselineDocs(cwd);
  writeFileSync(join(cwd, 'src'), 'not a directory', 'utf8');

  const result = runAutopilotPipeline(cwd, { strict: true, maxPasses: '1' });
  const scannerIssue = result.issues.find((issue) => issue.id.startsWith('scanner-failed:'));

  assert.ok(scannerIssue);
  assert.equal(scannerIssue.severity, 'error');
  assert.equal(result.exitCode, 1);
});

test('autopilot correctly wires and executes standards flags (vibe-coding)', () => {
  const cwd = tempProject();
  writeBaselineDocs(cwd);

  const srcDir = join(cwd, 'src');
  mkdirSync(srcDir, { recursive: true });
  writeFileSync(
    join(srcDir, 'Component.jsx'),
    `
    // @ts-ignore
    const value = 'vibe';
    `,
    'utf8'
  );

  // Without the standards flag, the no-ts-ignore issue shouldn't be matched
  const resultWithoutStandards = runAutopilotPipeline(cwd, { maxPasses: '1' });
  const hasTsIgnoreWithout = resultWithoutStandards.issues.some((issue) => issue.id === 'no-ts-ignore');
  assert.equal(hasTsIgnoreWithout, false, 'Should not detect no-ts-ignore without vibe-coding standards enabled');

  // With the standards flag enabled, the no-ts-ignore issue should be detected
  const resultWithStandards = runAutopilotPipeline(cwd, { standards: 'vibe-coding', maxPasses: '1' });
  const hasTsIgnoreWith = resultWithStandards.issues.some((issue) => issue.id === 'no-ts-ignore');
  assert.equal(hasTsIgnoreWith, true, 'Should detect no-ts-ignore when vibe-coding standards is enabled');
});

