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

test('safe repair rejects a stale plan instead of overwriting a concurrent source edit', () => {
  const root = tempDir();
  const file = join(root, 'Button.jsx');
  const original = '<button>Open</button>\n';
  const concurrentEdit = '<button data-user-edit="true">Open</button>\n';

  writeFileSync(file, original, 'utf8');

  let modeRead = false;
  const flags = {
    maxFixFiles: 10,
    maxFixLines: 100,
    maxLinesPerFile: 10,
    get safeFix() {
      if (!modeRead) {
        modeRead = true;
        writeFileSync(file, concurrentEdit, 'utf8');
      }
      return true;
    }
  };

  const result = runSourceFixEngine(root, [buttonFinding('Button.jsx')], flags);

  assert.equal(result.applied.length, 0, 'a stale plan must never be accepted as applied');
  assert.equal(readFileSync(file, 'utf8'), concurrentEdit, 'the concurrent edit must not be overwritten');
  assert.ok(result.failed.some((entry) => entry.reason === 'source-changed'), 'the stale plan should be reported explicitly');
});
