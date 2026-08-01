import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLoopGate } from '../src/core/loopGate.js';
import { readLoopState } from '../src/core/loopState.js';

test('loopGate evaluates allowlists and denylists correctly', () => {
  const gateConfig = {
    autoMergeAllowlist: ['patch', 'dependabot'],
    denylist: ['docs/core-primitives.md']
  };

  const allowed = checkLoopGate('patch', 'src/utils.js', gateConfig);
  assert.equal(allowed.ok, true);

  const denied = checkLoopGate('patch', 'docs/core-primitives.md', gateConfig);
  assert.equal(denied.ok, false);
});
