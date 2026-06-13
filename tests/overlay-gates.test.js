import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const cli = new URL('../bin/cli.js', import.meta.url).pathname;
const cwd = () => mkdtempSync(join(tmpdir(), 'vdma-overlay-'));
const run = (args, dir) => spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8' });

function issuesFor(design) {
  const dir = cwd();
  run(['init'], dir);
  writeFileSync(join(dir, 'DESIGN.md'), design);
  return JSON.parse(run(['audit', '--json'], dir).stdout).issues;
}

test('overlay gate catches missing viewport contract', () => {
  const issues = issuesFor('# DESIGN.md\nUse a modal.');
  assert.ok(issues.some((i) => i.id === 'modal-viewport-contract-missing'));
});

test('layered UI gate catches missing stacking plan', () => {
  const issues = issuesFor('# DESIGN.md\nUse a sticky header.');
  assert.ok(issues.some((i) => i.id === 'stacking-plan-missing'));
});
