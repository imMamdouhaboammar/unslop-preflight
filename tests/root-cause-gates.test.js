import test from 'node:test';
import assert from 'node:assert/strict';
import { rootCauseRules } from '../src/rules/rootCause.js';

const ctx = (design) => ({ files: { 'PRODUCT.md': '', 'DESIGN.md': design, 'AGENTS.md': '' } });

test('root cause mode is required for issue language', () => {
  const issue = rootCauseRules.find((r) => r.id === 'root-cause-mode-missing');
  assert.equal(issue.test(ctx('Fix the modal overflow issue.')), true);
});

test('patch language is blocked without diagnosis', () => {
  const issue = rootCauseRules.find((r) => r.id === 'symptom-patch-language');
  assert.equal(issue.test(ctx('Use z-index: 9999 as a quick fix.')), true);
});
