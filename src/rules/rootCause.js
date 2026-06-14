import { rule } from './utils.js';

const problemTerms = /\b(bug|issue|problem|broken|failure|regression|fix|repair|overflow|clipping|layout shift|z-index|viewport|modal|popup|drawer|dropdown|tooltip|toast|focus trap)\b/i;
// Must require AFFIRMATIVE root-cause practice. Avoid false matches on "no need to diagnose" etc.
const rootCauseTerms = /root cause mode|root-cause mode|diagnose (before|first|the|root)|reproduce (the|before|and)|root cause analysis|underlying cause|cause analysis|fix from the root|حل المشكلة من جذورها|جذور المشكلة/i;
// Expanded: catches technical z-index hacks AND governance anti-patterns in AGENTS.md
const patchTerms = /quick fix|workaround|temporary fix|hack|just increase|just raise|z-?\[?9999\]?|z-index\s*:\s*9999|magic number|fix (it|the|visible)? ?(issue|bug|problem) (quickly|fast|first)|no need.*(diagnos|time|root|analysis)|skip diagnos/i;
const proofTerms = /verify|verification|proof|test|regression|re-check|reproduce|acceptance|qa/i;
// Anti-patterns that explicitly reject diagnosis governance
const agentAntiPatterns = /no need.*(diagnos|root|analysis)|skip.*(diagnos|root|qa|accessibility)|patch.*(visible|first)|fix (it )?quickly|use a workaround/i;

function needsRootCause(ctx) {
  const text = `${ctx.files['PRODUCT.md'] || ''}\n${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`;
  return problemTerms.test(text) || agentAntiPatterns.test(ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || '');
}

export const rootCauseRules = [
  rule(
    'root-cause-mode-missing',
    'Problems must use Root Cause Mode before implementation',
    'root-cause-governance',
    'error',
    'AGENTS.md',
    (ctx) => needsRootCause(ctx) && !rootCauseTerms.test(`${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`),
    'Add a Root Cause Mode section: reproduce the issue, separate symptoms from cause, identify the smallest root fix, and define verification proof.',
    'suggested'
  ),
  rule(
    'agent-no-diagnosis-policy',
    'AGENTS.md explicitly rejects diagnosis — this is an anti-pattern',
    'root-cause-governance',
    'error',
    'AGENTS.md',
    (ctx) => agentAntiPatterns.test(ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''),
    'Remove or invert anti-diagnosis instructions. The agent must diagnose before patching. "Fix quickly" and "use a workaround" are forbidden as standing policies.',
    'safeDocs'
  ),
  rule(
    'symptom-patch-language',
    'Patch language is not allowed without diagnosis',
    'root-cause-governance',
    'error',
    'AGENTS.md',
    (ctx) => {
      const all = `${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`;
      return patchTerms.test(all) && !rootCauseTerms.test(all);
    },
    'Replace quick-fix language with a diagnosis-first plan. Do not raise z-index, force layout, or add magic numbers before identifying the cause.',
    'suggested'
  ),
  rule(
    'root-cause-verification-missing',
    'Root fixes need verification proof',
    'root-cause-governance',
    'error',
    'DESIGN.md',
    (ctx) => needsRootCause(ctx) && rootCauseTerms.test(`${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`) && !proofTerms.test(ctx.files['DESIGN.md'] || ''),
    'Add verification proof: reproduction case, regression check, viewport/state coverage, or acceptance criteria that prove the root fix worked.',
    'suggested'
  )
];
