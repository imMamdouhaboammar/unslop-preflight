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

test('icon markers remain eligible for the existing bounded null-alt repair', () => {
  const engine = new SourceFixEngine('/tmp');
  const content = '<img className="status-icon" src="/icons/online.svg" />';
  const result = engine.applyFixes('Status.jsx', content, finding);

  assert.match(result.content, /alt=""/);
  assert.equal(result.fixes.length, 1);
});
