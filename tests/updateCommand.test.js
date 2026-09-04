import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { executeUpdatePlan, npmExecutable, planUpdate } from '../src/commands/update.js';

function temp() {
  return mkdtempSync(join(tmpdir(), 'unslop-update-'));
}

function writePackage(cwd, pkg) {
  writeFileSync(join(cwd, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
}

test('local projects update the canonical unslop-preflight package', () => {
  const cwd = temp();
  writePackage(cwd, {
    name: 'example-app',
    dependencies: { 'unslop-preflight': '^1.15.2' }
  });

  assert.deepEqual(planUpdate(cwd), {
    scope: 'local',
    command: 'npm',
    args: ['install', 'unslop-preflight@latest'],
    cwd
  });
});

test('the unslop binary alias is not treated as npm package identity', () => {
  const cwd = temp();
  writePackage(cwd, {
    name: 'example-app',
    dependencies: { unslop: '^0.1.7' }
  });

  const plan = planUpdate(cwd);
  assert.equal(plan.scope, 'global');
  assert.deepEqual(plan.args, ['install', '-g', 'unslop-preflight@latest']);
  assert.equal(plan.args.some((arg) => arg === 'unslop@latest'), false);
});

test('running from the package repository never self-adds a local dependency', () => {
  const cwd = temp();
  writePackage(cwd, {
    name: 'unslop-preflight',
    devDependencies: { 'unslop-preflight': '^1.15.2' }
  });

  assert.deepEqual(planUpdate(cwd), {
    scope: 'global',
    command: 'npm',
    args: ['install', '-g', 'unslop-preflight@latest']
  });
});

test('devDependency installations are updated locally', () => {
  const cwd = temp();
  writePackage(cwd, {
    name: 'example-app',
    devDependencies: { 'unslop-preflight': '^1.15.2' }
  });

  const plan = planUpdate(cwd);
  assert.equal(plan.scope, 'local');
  assert.equal(plan.cwd, cwd);
  assert.deepEqual(plan.args, ['install', 'unslop-preflight@latest']);
});

test('shell-free npm execution uses the Windows command shim', () => {
  assert.equal(npmExecutable('win32'), 'npm.cmd');
  assert.equal(npmExecutable('linux'), 'npm');
  assert.equal(npmExecutable('darwin'), 'npm');
});

test('update execution uses the planned argv without a shell', () => {
  const cwd = temp();
  const plan = {
    scope: 'local',
    command: 'npm',
    args: ['install', 'unslop-preflight@latest'],
    cwd
  };
  const calls = [];

  executeUpdatePlan(plan, (command, args, options) => {
    calls.push({ command, args, options });
  });

  assert.deepEqual(calls, [{
    command: 'npm',
    args: ['install', 'unslop-preflight@latest'],
    options: { stdio: 'inherit', cwd }
  }]);
});
