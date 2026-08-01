import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractDOMTree, checkViewportOverflow } from '../src/scanners/browserAutomation.js';

test('browserAutomation extracts DOM tree and checks layout bounds', () => {
  const mockDOM = { tag: 'div', width: 1200, viewportWidth: 1000 };
  const overflow = checkViewportOverflow(mockDOM);
  assert.equal(overflow.isOverflowing, true);
  assert.equal(overflow.overflowPx, 200);
});
