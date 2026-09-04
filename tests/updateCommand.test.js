import assert from 'node:assert/strict';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { update } from '../src/commands/update.js';

async function withFakeNpm(run) {
  const root = mkdtempSync(path.join(tmpdir(), 'unslop-update-'));
  const binDir = path.join(root, 'bin');
  const capturePath = path.join(root, 'npm-args.txt');
  const projectDir = path.join(root, 'project');
  const originalPath = process.env.PATH;
  const originalCapture = process.env.CAPTURE_PATH;

  try {
    mkdirSync(binDir, { recursive: true });
    mkdirSync(projectDir, { recursive: true });
    const npmPath = path.join(binDir, 'npm');
    writeFileSync(npmPath, '#!/bin/sh\nprintf "%s" "$*" > "$CAPTURE_PATH"\n', 'utf8');
    chmodSync(npmPath, 0o755);
    process.env.PATH = `${binDir}${path.delimiter}${originalPath || ''}`;
    process.env.CAPTURE_PATH = capturePath;
    await run({ projectDir, capturePath });
  } finally {
    process.env.PATH = originalPath;
    if (originalCapture === undefined) delete process.env.CAPTURE_PATH;
    else process.env.CAPTURE_PATH = originalCapture;
    rmSync(root, { recursive: true, force: true });
  }
}

async function captureUpdateCommand(packageJson) {
  let command;
  await withFakeNpm(async ({ projectDir, capturePath }) => {
    writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson), 'utf8');

    const result = await update({ cwd: projectDir });

    assert.equal(result.summary.errors, 0);
    command = readFileSync(capturePath, 'utf8');
  });
  return command;
}

test('update targets the local unslop-preflight dependency, not the unslop binary alias', async () => {
  const command = await captureUpdateCommand({ dependencies: { 'unslop-preflight': '^1.15.2' } });
  assert.equal(command, 'install unslop-preflight@latest');
});

test('update recognizes unslop-preflight when it is installed as a dev dependency', async () => {
  const command = await captureUpdateCommand({ devDependencies: { 'unslop-preflight': '^1.15.2' } });
  assert.equal(command, 'install unslop-preflight@latest');
});

test('an unrelated unslop dependency does not grant local self-update identity', async () => {
  const command = await captureUpdateCommand({ dependencies: { unslop: '^0.1.7' } });
  assert.equal(command, 'install -g unslop-preflight@latest');
});

test('update targets the global unslop-preflight package when no local dependency exists', async () => {
  const command = await captureUpdateCommand({ name: 'demo-app' });
  assert.equal(command, 'install -g unslop-preflight@latest');
});
