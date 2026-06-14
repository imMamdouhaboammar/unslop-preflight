import test from 'node:test';
import assert from 'node:assert/strict';
import { modalViewportRules } from '../src/rules/modalViewport.js';
import { typographyRules } from '../src/rules/typography.js';
import { rules } from '../src/rules/index.js';

function ctx(design) {
  return { files: { 'DESIGN.md': design }, all: design };
}

test('modal scrollbar quality gate is registered', () => {
  assert.ok(rules.some((r) => r.id === 'modal-scrollbar-aesthetic-missing'));
});

test('typography gates are registered', () => {
  assert.ok(rules.some((r) => r.id === 'typography-scale-missing'));
  assert.ok(rules.some((r) => r.id === 'oversized-type-without-responsive-guard'));
});

test('long modal scroll needs restrained scrollbar treatment', () => {
  const ids = modalViewportRules
    .filter((r) => r.test(ctx('Modal with viewport contract, max-width, max-height: 100dvh, overflow-y-auto, mobile bottom sheet, 320x568, 375x667, 390x844, landscape, keyboard-open, no clipping.')))
    .map((r) => r.id);
  assert.ok(ids.includes('modal-scrollbar-aesthetic-missing'));
});

test('oversized typography needs responsive guard', () => {
  const ids = typographyRules
    .filter((r) => r.test(ctx('Typography scale: display text 72px, h1 56px, body 16px.')))
    .map((r) => r.id);
  assert.ok(ids.includes('oversized-type-without-responsive-guard'));
});
