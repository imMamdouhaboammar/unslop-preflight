import { rule } from './utils.js';

const problemTerms = /\b(bug|issue|problem|broken|failure|regression|fix|repair|overflow|clipping|layout shift|z-index|viewport|modal|popup|drawer|dropdown|tooltip|toast|focus trap)\b/i;
const rootCauseTerms = /root cause|diagnos|reproduc|symptom|underlying cause|cause analysis|fix from the root|حل المشكلة من جذورها|جذور المشكلة/i;
const patchTerms = /quick fix|workaround|temporary fix|hack|just increase|just raise|z-?\[?9999\]?|z-index\s*:\s*9999|magic number/i;
const proofTerms = /verify|verification|proof|test|regression|re-check|reproduce|acceptance|qa/i;

function needsRootCause(ctx) {
  const text = `${ctx.files['PRODUCT.md'] || ''}\n${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`;
  return problemTerms.test(text);
}

export const rootCauseRules = [
  rule(
    'root-cause-mode-missing',
    'Problems must use Root Cause Mode before implementation',
    'root-cause-governance',
    'error',
    'DESIGN.md',
    (ctx) => needsRootCause(ctx) && !rootCauseTerms.test(`${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`),
    'Add a Root Cause Mode section: reproduce the issue, separate symptoms from cause, identify the smallest root fix, and define verification proof.',
    'suggested'
  ),
  rule(
    'symptom-patch-language',
    'Patch language is not allowed without diagnosis',
    'root-cause-governance',
    'error',
    'DESIGN.md',
    (ctx) => patchTerms.test(ctx.files['DESIGN.md'] || '') && !rootCauseTerms.test(ctx.files['DESIGN.md'] || ''),
    'Replace quick-fix language with a diagnosis-first plan. Do not raise z-index, force layout, or add magic numbers before identifying the cause.',
    'suggested'
  ),
  rule(
    'root-cause-verification-missing',
    'Root fixes need verification proof',
    'root-cause-governance',
    'warning',
    'DESIGN.md',
    (ctx) => needsRootCause(ctx) && rootCauseTerms.test(`${ctx.files['DESIGN.md'] || ''}\n${ctx.files['AGENTS.md'] || ctx.files['AGENT.md'] || ''}`) && !proofTerms.test(ctx.files['DESIGN.md'] || ''),
    'Add verification proof: reproduction case, regression check, viewport/state coverage, or acceptance criteria that prove the root fix worked.',
    'suggested'
  )
];
