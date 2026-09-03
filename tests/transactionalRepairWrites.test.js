import test from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runSourceFixEngine } from '../src/core/sourceFixEngine.js';
import { SafetyValidator } from '../src/core/safetyValidator.js';

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

test('safe repair rejects an entire batch when a later plan becomes stale', () => {
  const root = tempDir();
  const first = join(root, 'One.jsx');
  const second = join(root, 'Two.jsx');
  const original = '<button>Open</button>\n';
  const concurrentEdit = '<button>Open</button>\n// user edit after scan\n';
  writeFileSync(first, original, 'utf8');
  writeFileSync(second, original, 'utf8');

  const originalValidatePatches = SafetyValidator.prototype.validatePatches;
  let validations = 0;

  SafetyValidator.prototype.validatePatches = function validatePatchesWithConcurrentEdit(patches) {
    validations += 1;
    const result = originalValidatePatches.call(this, patches);
    if (validations === 3) {
      writeFileSync(second, concurrentEdit, 'utf8');
    }
    return result;
  };

  try {
    const result = runSourceFixEngine(root, [buttonFinding('One.jsx'), buttonFinding('Two.jsx')], {
      safeFix: true,
      maxFixFiles: 10,
      maxFixLines: 100,
      maxLinesPerFile: 10
    });

    assert.equal(result.applied.length, 0, 'stale repair evidence must abort the whole batch');
    assert.equal(readFileSync(first, 'utf8'), original, 'an earlier valid target must not be written before stale evidence is detected');
    assert.equal(readFileSync(second, 'utf8'), concurrentEdit, 'the concurrent user edit must remain byte-for-byte intact');
    assert.ok(
      result.skipped.some(entry => entry.file === 'Two.jsx' && entry.reason === 'stale-source'),
      'the stale target should explain that its source evidence became stale'
    );
    assert.ok(
      result.skipped.some(entry => entry.file === 'One.jsx' && entry.reason === 'transaction-aborted'),
      'otherwise-valid peers should explain that the transaction was aborted'
    );
  } finally {
    SafetyValidator.prototype.validatePatches = originalValidatePatches;
  }
});
