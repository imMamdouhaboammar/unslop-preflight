import { rule } from './utils.js';

const layeredUi = /modal|dialog|drawer|dropdown|tooltip|toast|popover|overlay|sticky header|fixed header|command palette|z-index|z index|stacking context/i;
const overlays = /modal|dialog|drawer|dropdown|tooltip|toast|popover|overlay|command palette/i;
const hasPlan = /stacking plan|layer plan|placement plan|layering plan|root cause/i;
const hasScale = /layer scale|z-index scale|z index scale|layer tokens|z-index tokens|z index tokens/i;
const hasAudit = /stacking context audit|stacking audit|ancestor audit|transform|opacity|filter|contain|isolation|will-change|overflow hidden|overflow-hidden|fixed parent|sticky parent/i;
const hasPortalPolicy = /portal policy|portal root|overlay root|document body|top layer|native dialog|local dom/i;
const hasConflictMatrix = /conflict matrix|layer order|header vs|drawer vs|modal vs|toast vs|tooltip vs|dropdown vs/i;
const blindEscalation = /z-\[?9999\]?|z-\[?999\]?|z-index\s*:\s*9999|z-index\s*:\s*999|increase z-index|raise z-index|z-index until|use z-9999|use z-999|just (increase|raise|bump) (the )?z/i;

function design(ctx) {
  return ctx.files['DESIGN.md'] || '';
}

function mentionsLayeredUi(ctx) {
  return layeredUi.test(design(ctx));
}

export const stackingRules = [
  rule(
    'stacking-plan-missing',
    'Stacked UI needs a placement plan before implementation',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => mentionsLayeredUi(ctx) && !hasPlan.test(design(ctx)),
    'Add a stacking or placement plan that explains what must appear above what and why.'
  ),
  rule(
    'stacking-context-audit-missing',
    'Layered UI needs a stacking context audit',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => mentionsLayeredUi(ctx) && !hasAudit.test(design(ctx)),
    'Audit ancestors for transform, opacity, filter, contain, isolation, will-change, overflow clipping, fixed, and sticky positioning.'
  ),
  rule(
    'layer-scale-missing',
    'Layered UI needs a named layer scale',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => mentionsLayeredUi(ctx) && !hasScale.test(design(ctx)),
    'Define layer tokens for base content, sticky headers, dropdowns, drawers, modals, toasts, and alerts.'
  ),
  rule(
    'overlay-portal-policy-missing',
    'Overlays need an explicit portal or top-layer policy',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => overlays.test(design(ctx)) && !hasPortalPolicy.test(design(ctx)),
    'State whether overlays render in local DOM, a portal root, document body, native dialog top layer, or another overlay root.'
  ),
  rule(
    'blind-z-index-escalation',
    'Do not fix layering with blind z-index escalation',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => blindEscalation.test(design(ctx)) && (!hasPlan.test(design(ctx)) || !hasAudit.test(design(ctx)) || !hasScale.test(design(ctx))),
    'Replace blind z-index escalation with root-cause diagnosis, stacking context audit, layer tokens, and portal policy.'
  ),
  rule(
    'layer-conflict-matrix-missing',
    'Layered UI needs a conflict matrix',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => mentionsLayeredUi(ctx) && !hasConflictMatrix.test(design(ctx)),
    'Add a conflict matrix for header, dropdown, drawer, modal, tooltip, toast, and global alert ordering.'
  )
];
