import test from 'node:test';
import assert from 'node:assert/strict';
import { agentHarnessRules } from '../src/rules/agentHarness.js';

const ids = agentHarnessRules.map((rule) => rule.id);

test('agent harness rules are registered', () => {
  assert.ok(ids.includes('install-agent-harness-missing'));
  assert.ok(ids.includes('agent-harness-priority-matrix-missing'));
  assert.ok(ids.includes('agent-harness-trust-note-missing'));
});
