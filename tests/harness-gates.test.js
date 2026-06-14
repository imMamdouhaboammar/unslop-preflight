import test from 'node:test';
import assert from 'node:assert/strict';
import { rules } from '../src/rules/index.js';
import { agentHarnessRules } from '../src/rules/agentHarness.js';

const ids = agentHarnessRules.map((rule) => rule.id);
const pipelineIds = rules.map((rule) => rule.id);
const ctx = (agents = '', design = '') => ({
  files: { 'PRODUCT.md': '', 'DESIGN.md': design, 'AGENTS.md': agents }
});

test('agent harness rules are registered', () => {
  assert.ok(ids.includes('install-agent-harness-missing'));
  assert.ok(ids.includes('agent-harness-priority-matrix-missing'));
  assert.ok(ids.includes('agent-harness-trust-note-missing'));
});

test('agent harness rules are wired into the audit pipeline', () => {
  assert.ok(pipelineIds.includes('install-agent-harness-missing'));
});

test('harness guidance needs a context-overhead guard', () => {
  const rule = agentHarnessRules.find((item) => item.id === 'agent-harness-bulk-install-guard-missing');
  assert.equal(rule.test(ctx('Agent Harness: recommend project tools.')), true);
});
