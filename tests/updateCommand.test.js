import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { executeUpdatePlan, planUpdate } from '../src/commands/update.js';

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

  assert.deepEqual(planUpdate(cwd, 'linux'), {
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

  const plan = planUpdate(cwd, 'linux');
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

  assert.deepEqual(planUpdate(cwd, 'linux'), {
    scope: 'global',
    command: 'npm',
    args: ['install', '-g', 'unslop-preflight@latest']
  });
});

test('devDependency installations remain devDependencies after update', () => {
  const cwd = temp();
  writePackage(cwd, {
    name: 'example-app',
    devDependencies: { 'unslop-preflight': '^1.15.2' }
  });

  const plan = planUpdate(cwd, 'linux');
  assert.equal(plan.scope, 'local');
  assert.equal(plan.cwd, cwd);
  assert.deepEqual(plan.args, ['install', '--save-dev', 'unslop-preflight@latest']);
});

test('Windows invokes npm.cmd through cmd.exe instead of execFileSync directly', () => {
  const cwd = temp();
  const comspec = 'C:\\Windows\\System32\\cmd.exe';

  assert.deepEqual(planUpdate(cwd, 'win32', comspec), {
    scope: 'global',
    command: comspec,
    args: ['/d', '/s', '/c', 'npm.cmd', 'install', '-g', 'unslop-preflight@latest']
  });
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
