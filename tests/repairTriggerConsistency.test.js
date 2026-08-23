import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceFixEngine } from '../src/core/sourceFixEngine.js';

const engine = new SourceFixEngine(process.cwd());

test('image sizing findings do not trigger an unrelated lazy-loading repair', () => {
  const input = '<img src="/product.png" alt="Product">';
  const finding = [{ rule: 'image-without-size-review' }];

  const result = engine.applyFixes('src/Product.jsx', input, finding);

  assert.equal(result.content, input);
  assert.deepEqual(result.fixes, []);
});

test('target blank repair removes its triggering condition and is idempotent', () => {
  const input = '<a href="/docs" target="_blank">Docs</a>';
  const finding = [{ rule: 'target-blank-without-rel' }];

  const first = engine.applyFixes('src/Docs.jsx', input, finding);
  assert.match(first.content, /rel="noopener noreferrer"/);
  assert.equal(first.fixes.length, 1);

  const second = engine.applyFixes('src/Docs.jsx', first.content, finding);
  assert.equal(second.content, first.content);
  assert.deepEqual(second.fixes, []);
});
