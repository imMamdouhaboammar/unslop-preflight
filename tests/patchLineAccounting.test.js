import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runSourceFixEngine } from '../src/core/sourceFixEngine.js';

test('safe repair validates actual changed lines instead of total file length', () => {
  const root = mkdtempSync(join(tmpdir(), 'unslop-patch-lines-'));
  const file = join(root, 'LongLinks.jsx');
  const filler = Array.from({ length: 80 }, (_, index) => `const filler${index} = ${index};`);
  const unsafeLink = '<a href="https://example.com" target="_blank">Example</a>';
  writeFileSync(file, [...filler, unsafeLink].join('\n'), 'utf8');

  const result = runSourceFixEngine(root, [
    {
      rule: 'target-blank-without-rel',
      file: 'LongLinks.jsx',
      excerpt: unsafeLink
    }
  ], {
    safeFix: true,
    maxLinesPerFile: 4,
    maxFixLines: 4
  });

  assert.equal(result.applied.length, 1, 'single-line repair should stay within a four-line safety budget');
  assert.equal(result.skipped.length, 0);
  assert.match(readFileSync(file, 'utf8'), /rel="noopener noreferrer"/);
});
