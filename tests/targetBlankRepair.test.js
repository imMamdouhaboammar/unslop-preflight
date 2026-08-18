import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceFixEngine } from '../src/core/sourceFixEngine.js';

const finding = [{ rule: 'target-blank-without-rel' }];

function repair(content) {
  return new SourceFixEngine('/tmp').applyFixes('src/Link.jsx', content, finding);
}

test('target blank repair preserves existing rel tokens and adds only noopener', () => {
  const input = '<a href="/docs" target="_blank" rel="nofollow ugc">Docs</a>';
  const { content, fixes } = repair(input);

  assert.equal(content, '<a href="/docs" target="_blank" rel="nofollow ugc noopener">Docs</a>');
  assert.equal(fixes.length, 1);
});

test('target blank repair preserves single-quoted rel attributes', () => {
  const input = "<a rel='external' target='_blank' href='/docs'>Docs</a>";
  const { content } = repair(input);

  assert.equal(content, "<a rel='external noopener' target='_blank' href='/docs'>Docs</a>");
});

test('target blank repair leaves already-safe rel tokens unchanged', () => {
  const input = '<a target="_blank" rel="nofollow noopener">Docs</a>';
  const { content, fixes } = repair(input);

  assert.equal(content, input);
  assert.equal(fixes.length, 0);
});

test('target blank repair is idempotent after extending an existing rel attribute', () => {
  const input = '<a target="_blank" rel="nofollow">Docs</a>';
  const first = repair(input).content;
  const second = repair(first).content;

  assert.equal(first, '<a target="_blank" rel="nofollow noopener">Docs</a>');
  assert.equal(second, first);
});

test('target blank repair matches detector case-insensitivity without rewriting tag case', () => {
  const input = '<A href="/docs" TARGET="_BLANK" rel="nofollow">Docs</A>';
  const { content } = repair(input);

  assert.equal(content, '<A href="/docs" TARGET="_BLANK" rel="nofollow noopener">Docs</A>');
});
