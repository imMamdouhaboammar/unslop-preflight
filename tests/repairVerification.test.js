import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runSourceFixEngine } from '../src/core/sourceFixEngine.js';

function tempProject() {
  const root = mkdtempSync(join(tmpdir(), 'unslop-repair-verification-'));
  mkdirSync(join(root, 'src'));
  return root;
}

test('safe repair rolls back when the triggering detector still fires', () => {
  const root = tempProject();
  const file = join(root, 'src', 'Card.jsx');
  const original = '<img src="/card.jpg" />\n';
  writeFileSync(file, original);

  const result = runSourceFixEngine(root, [{
    file: 'src/Card.jsx',
    rule: 'image-without-size-review',
    level: 'warning',
    excerpt: 'Image needs an explicit sizing contract to prevent layout shift.'
  }], { safeFix: true });

  assert.equal(readFileSync(file, 'utf8'), original);
  assert.equal(result.applied.length, 0);
  assert.equal(result.failed.length, 1);
  assert.equal(result.failed[0].findingId, 'image-without-size-review');
  assert.equal(result.failed[0].reason, 'verification-failed');
});
