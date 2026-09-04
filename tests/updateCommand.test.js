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

test('update targets the local unslop-preflight dependency, not the unslop binary alias', async () => {
  await withFakeNpm(async ({ projectDir, capturePath }) => {
    writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify({ dependencies: { 'unslop-preflight': '^1.15.2' } }),
      'utf8'
    );

    const result = await update({ cwd: projectDir });

    assert.equal(result.summary.errors, 0);
    assert.equal(readFileSync(capturePath, 'utf8'), 'install unslop-preflight@latest');
  });
});

test('update targets the global unslop-preflight package when no local dependency exists', async () => {
  await withFakeNpm(async ({ projectDir, capturePath }) => {
    writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify({ name: 'demo-app' }), 'utf8');

    const result = await update({ cwd: projectDir });

    assert.equal(result.summary.errors, 0);
    assert.equal(readFileSync(capturePath, 'utf8'), 'install -g unslop-preflight@latest');
  });
});
