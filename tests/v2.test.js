import test from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import { runAutopilotPipeline } from '../src/core/autopilotPlan.js';

const fixturePath = join(process.cwd(), 'tests', 'fixtures', 'visual-slop');

test('V2 Pipeline E2E - Fingerprint, Scanner, Planner, Report', () => {
  const result = runAutopilotPipeline(fixturePath, { 'dry-run': true });

  // 1. Check Fingerprint
  assert.strictEqual(result.fingerprint.framework, 'next', 'Fingerprint should detect Next.js');
  assert.ok(result.fingerprint.srcDirs.includes('src/components'), 'Should detect src/components dir');

  // 2. Check Evidences from Source Scanner
  const evidences = result.evidences || [];
  
  const zIndexIssue = evidences.find(e => e.ruleName === 'arbitrary-z-index-slop');
  assert.ok(zIndexIssue, 'Should catch arbitrary z-[99999]');
  assert.strictEqual(zIndexIssue.type, 'modular');

  const widthIssue = evidences.find(e => e.ruleName === 'fixed-width-mobile-risk');
  assert.ok(widthIssue, 'Should catch w-[500px]');

  const vhIssue = evidences.find(e => e.ruleName === 'height-100vh-mobile-risk');
  assert.ok(vhIssue, 'Should catch h-100vh');

  const typoIssue = evidences.find(e => e.ruleName === 'oversized-typography-mobile-risk');
  assert.ok(typoIssue, 'Should catch text-9xl');

  const portalIssue = evidences.find(e => e.ruleName === 'overlay-missing-portal');
  assert.ok(portalIssue, 'Should catch fixed overlay without portal');

  // 3. Check Harness Advisor Recommendations
  const uiHarness = evidences.find(e => e.ruleName === 'missing-skill-frontend-ui-engineering');
  assert.ok(uiHarness, 'Should recommend frontend-ui-engineering because of Next.js');
  
  const lcpHarness = evidences.find(e => e.ruleName === 'missing-skill-debug-optimize-lcp');
  assert.ok(lcpHarness, 'Should recommend debug-optimize-lcp because of Next.js');

  const devtoolsHarness = evidences.find(e => e.ruleName === 'missing-skill-chrome-devtools');
  assert.ok(devtoolsHarness, 'Should recommend chrome-devtools universally');

  // 4. Check Exit Code & Summary
  assert.ok(result.exitCode > 0, 'Exit code should be non-zero due to blockers/errors');
  assert.strictEqual(result.summary.readiness, 'blocked', 'Readiness should be blocked due to multiple source code errors');
});
