import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SafetyValidator } from '../src/core/safetyValidator.js';
import { runSourceFixEngine } from '../src/core/sourceFixEngine.js';

function tempDir(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
}

function buttonFinding(file) {
  return {
    rule: 'missing-button-type',
    file,
    excerpt: '<button>Open</button>'
  };
}

test('safe repair rejects a symlink that escapes the project root', { skip: process.platform === 'win32' }, () => {
  const root = tempDir('unslop-symlink-root-');
  const outside = tempDir('unslop-symlink-outside-');
  const outsideFile = join(outside, 'External.jsx');
  const linkedFile = join(root, 'Linked.jsx');
  const original = '<button>Open</button>\n';

  writeFileSync(outsideFile, original, 'utf8');
  symlinkSync(outsideFile, linkedFile);

  const validator = new SafetyValidator(root);
  const safety = validator.validateFile(linkedFile);
  assert.equal(safety.valid, false, 'a lexical in-root path must not authorize an out-of-root symlink target');

  const result = runSourceFixEngine(root, [buttonFinding('Linked.jsx')], {
    safeFix: true,
    maxFixFiles: 10,
    maxFixLines: 100,
    maxLinesPerFile: 10
  });

  assert.equal(result.applied.length, 0);
  assert.equal(readFileSync(outsideFile, 'utf8'), original, 'safe repair must not mutate a symlink target outside the repository');
});

test('safe repair preserves valid in-root symlink workflows', { skip: process.platform === 'win32' }, () => {
  const root = tempDir('unslop-symlink-in-root-');
  const target = join(root, 'Target.jsx');
  const alias = join(root, 'Alias.jsx');
  const original = '<button>Open</button>\n';

  writeFileSync(target, original, 'utf8');
  symlinkSync(target, alias);

  const validator = new SafetyValidator(root);
  assert.equal(validator.validateFile(alias).valid, true);

  const result = runSourceFixEngine(root, [buttonFinding('Alias.jsx')], {
    safeFix: true,
    maxFixFiles: 10,
    maxFixLines: 100,
    maxLinesPerFile: 10
  });

  assert.equal(result.applied.length, 1);
  assert.match(readFileSync(target, 'utf8'), /type="button"/);
});

test('symlinks cannot disguise forbidden in-root directories', { skip: process.platform === 'win32' }, () => {
  const root = tempDir('unslop-symlink-forbidden-');
  const dependencyDir = join(root, 'node_modules', 'pkg');
  const dependencyFile = join(dependencyDir, 'Hidden.jsx');
  const alias = join(root, 'LooksSafe.jsx');

  mkdirSync(dependencyDir, { recursive: true });
  writeFileSync(dependencyFile, '<button>Open</button>\n', 'utf8');
  symlinkSync(dependencyFile, alias);

  const validator = new SafetyValidator(root);
  const safety = validator.validateFile(alias);
  assert.equal(safety.valid, false);
  assert.match(safety.reason, /node_modules/);
});
