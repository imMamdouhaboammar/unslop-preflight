import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SafetyValidator } from '../src/core/safetyValidator.js';
import { runSourceFixEngine } from '../src/core/sourceFixEngine.js';

function tempDir(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
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

  const result = runSourceFixEngine(root, [{
    rule: 'missing-button-type',
    file: 'Linked.jsx',
    excerpt: '<button>Open</button>'
  }], {
    safeFix: true,
    maxFixFiles: 10,
    maxFixLines: 100,
    maxLinesPerFile: 10
  });

  assert.equal(result.applied.length, 0);
  assert.equal(readFileSync(outsideFile, 'utf8'), original, 'safe repair must not mutate a symlink target outside the repository');
});
