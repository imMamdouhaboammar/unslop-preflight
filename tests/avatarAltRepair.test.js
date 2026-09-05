import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceFixEngine } from '../src/core/sourceFixEngine.js';

const finding = [{ rule: 'image-without-alt' }];

test('avatar images are not automatically hidden from assistive technology', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<img className="avatar rounded-full" src="/users/maya-avatar.jpg" />';
  const result = engine.applyFixes('ProfileCard.jsx', content, finding);

  assert.equal(result.content, content);
  assert.equal(result.fixes.length, 0);
});

test('explicit decorative markers still allow a null alt repair', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<img className="decorative avatar-ring" src="/ui/ring.svg" />';
  const result = engine.applyFixes('ProfileCard.jsx', content, finding);

  assert.match(result.content, /alt=""/);
  assert.equal(result.fixes.length, 1);
});

test('semantic icon markers are not automatically hidden from assistive technology', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<img className="status-icon" src="/icons/online.svg" />';
  const result = engine.applyFixes('Status.jsx', content, finding);

  assert.equal(result.content, content);
  assert.equal(result.fixes.length, 0);
});

test('ambiguous decor markers are not treated as author intent to hide an image', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<img className="decor-preview" src="/catalog/decor-chair.jpg" />';
  const result = engine.applyFixes('CatalogCard.jsx', content, finding);

  assert.equal(result.content, content);
  assert.equal(result.fixes.length, 0);
});

test('ambiguous decorative-looking substrings do not authorize null alt repair', () => {
  const engine = new SourceFixEngine('/tmp');
  const cases = [
    '<img src="/patterns/checkout-flow.png" />',
    '<img className="bg-cover product-photo" src="/products/chair.jpg" />',
    '<img data-section="divider-report" src="/reports/q3.png" />',
    '<img id="spacer-mission-patch" src="/missions/spacer-patch.png" />'
  ];

  for (const content of cases) {
    const result = engine.applyFixes('MeaningfulImage.jsx', content, finding);
    assert.equal(result.content, content);
    assert.equal(result.fixes.length, 0);
  }
});

test('decorative text outside an exact static class token fails closed', () => {
  const engine = new SourceFixEngine('/tmp');
  const cases = [
    '<img src="/catalog/decorative-chair.jpg" />',
    '<img className="decorative-card" src="/catalog/chair.jpg" />',
    '<img data-purpose="decorative" src="/catalog/chair.jpg" />',
    '<img data-class="decorative" src="/catalog/chair.jpg" />',
    '<img aria-class="decorative" src="/catalog/chair.jpg" />',
    '<img className={isDecorative ? "decorative" : "photo"} src="/catalog/chair.jpg" />'
  ];

  for (const content of cases) {
    const result = engine.applyFixes('MeaningfulImage.jsx', content, finding);
    assert.equal(result.content, content);
    assert.equal(result.fixes.length, 0);
  }
});

test('explicit decorative null-alt repair is idempotent', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<img className="decorative flourish" src="/ui/flourish.svg" />';
  const first = engine.applyFixes('Decoration.jsx', content, finding);
  const second = engine.applyFixes('Decoration.jsx', first.content, finding);

  assert.match(first.content, /alt=""/);
  assert.equal(first.fixes.length, 1);
  assert.equal(second.content, first.content);
  assert.equal(second.fixes.length, 0);
});
