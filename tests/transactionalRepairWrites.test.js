import test from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runSourceFixEngine } from '../src/core/sourceFixEngine.js';

function tempDir() {
  return mkdtempSync(join(tmpdir(), 'unslop-transactional-repair-'));
}

function buttonFinding(file) {
  return {
    rule: 'missing-button-type',
    file,
    excerpt: '<button>Open</button>'
  };
}

test('safe repair rolls back earlier writes when a later planned write fails', { skip: process.platform === 'win32' }, () => {
  const root = tempDir();
  const first = join(root, 'One.jsx');
  const second = join(root, 'Two.jsx');
  const original = '<button>Open</button>\n';

  writeFileSync(first, original, 'utf8');
  writeFileSync(second, original, 'utf8');
  chmodSync(second, 0o444);

  let result;
  assert.doesNotThrow(() => {
    result = runSourceFixEngine(root, [buttonFinding('One.jsx'), buttonFinding('Two.jsx')], {
      safeFix: true,
      maxFixFiles: 10,
      maxFixLines: 100,
      maxLinesPerFile: 10
    });
  });

  assert.equal(result.applied.length, 0);
  assert.equal(readFileSync(first, 'utf8'), original, 'the first successful write must be rolled back');
  assert.equal(readFileSync(second, 'utf8'), original, 'the failed target must remain unchanged');
  assert.ok(result.failed.length >= 1, 'the failed transaction should be reported');
});
