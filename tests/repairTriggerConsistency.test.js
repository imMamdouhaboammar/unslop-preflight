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

test('target blank repair removes its detector condition and is idempotent', () => {
  const input = '<a href="/docs" target="_blank">Docs</a>';
  const finding = [{ rule: 'target-blank-without-rel' }];
  const detector = rule('target-blank-without-rel').pattern;

  assert.equal(detector.test(input), true);
  const first = engine.applyFixes('src/Docs.jsx', input, finding);
  assert.match(first.content, /rel="noopener noreferrer"/);
  assert.equal(first.fixes.length, 1);
  assert.equal(detector.test(first.content), false);

  const second = engine.applyFixes('src/Docs.jsx', first.content, finding);
  assert.equal(second.content, first.content);
  assert.deepEqual(second.fixes, []);
});
