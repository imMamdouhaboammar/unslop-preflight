import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanProse } from '../src/scanners/proseScanner.js';

test('proseScanner detects banned AI slop words and patterns', () => {
  const sample = `We need to delve into how we foster innovation and leverage cutting-edge technology.
  The question isn't whether we scale, it's how fast.
  The launch adds search, highlighting the team's commitment.`;

  const results = scanProse(sample);
  assert.ok(results.findings.length >= 3);
  assert.ok(results.findings.some(f => f.ruleId === 'banned-word-delve'));
  assert.ok(results.findings.some(f => f.ruleId === 'binary-contrast'));
  assert.ok(results.findings.some(f => f.ruleId === 'superficial-ing-clause'));
});
