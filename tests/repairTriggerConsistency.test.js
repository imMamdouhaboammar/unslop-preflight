import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceFixEngine } from '../src/core/sourceFixEngine.js';
import { sourceSlopRules } from '../src/scanners/sourceSlopScanner.js';

const engine = new SourceFixEngine(process.cwd());
const rule = (name) => sourceSlopRules.find((candidate) => candidate.name === name);

test('image sizing findings do not trigger an unrelated lazy-loading repair', () => {
  const input = '<img src="/product.png" alt="Product">';
  const finding = [{ rule: 'image-without-size-review' }];

  assert.equal(rule('image-without-size-review').pattern.test(input), true);
  const result = engine.applyFixes('src/Product.jsx', input, finding);

  assert.equal(result.content, input);
  assert.deepEqual(result.fixes, []);
});
