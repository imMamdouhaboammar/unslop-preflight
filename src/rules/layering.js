import { rule } from './utils.js';

const layerTerms = /\b(z-index|z index|stacking context|layer|overlay|modal|dialog|popover|drawer|dropdown|tooltip|toast|sticky header|fixed header)\b/i;
const diagnosis = /layer diagnosis|stacking diagnosis|root cause|layer intent|above what|below what|trapping ancestor|why this layer/i;
const layerScale = /layer scale|z-index scale|z index scale|z-token|z token|z-layer|base:\s*\d+|modal:\s*\d+|toast:\s*\d+/i;
const stackingAudit = /stacking context audit|transform|opacity|filter|backdrop-filter|contain|isolation|will-change|overflow hidden|position fixed|position sticky|z-index/i;
const portalPolicy = /portal|overlay root|document body|body portal|top layer|native dialog|popover api|render outside|local dom/i;
const blindZ = /z-\[?9999\]?|z-index:\s*9999|z-index:\s*99999|z-50\b|z-\[999\]/i;
const conflictMatrix = /conflict matrix|header vs|modal vs|drawer vs|dropdown vs|tooltip vs|toast vs|layer conflicts/i;

function hasLayering(ctx) {
  return layerTerms.test(ctx.files['DESIGN.md'] || '');
}

export const layeringRules = [
  rule(
    'layer-diagnosis-missing',
    'Layering or z-index work needs a diagnosis before implementation',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => hasLayering(ctx) && !diagnosis.test(ctx.files['DESIGN.md'] || ''),
    'Add a Layer Diagnosis section that states layer intent, what must appear above or below, and the likely root cause before changing z-index.'
  ),
  rule(
    'layer-scale-missing',
    'Project needs a named layer scale instead of ad-hoc z-index values',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => hasLayering(ctx) && !layerScale.test(ctx.files['DESIGN.md'] || ''),
    'Define a layer scale such as base, sticky header, dropdown, drawer, modal, toast, and critical alert with bounded numeric values.'
  ),
  rule(
    'stacking-context-audit-missing',
    'Layered UI needs a stacking context audit',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => hasLayering(ctx) && !stackingAudit.test(ctx.files['DESIGN.md'] || ''),
    'Audit ancestors for transform, opacity, filter, backdrop-filter, contain, isolation, will-change, overflow hidden, position fixed/sticky, and z-index.'
  ),
  rule(
    'overlay-portal-policy-missing',
    'Overlay components need a portal or top-layer policy',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => /\b(modal|dialog|popover|drawer|dropdown|tooltip|toast|overlay)\b/i.test(ctx.files['DESIGN.md'] || '') && !portalPolicy.test(ctx.files['DESIGN.md'] || ''),
    'State whether overlays render in local DOM, document body, overlay root, native dialog top layer, or a portal, and explain why.'
  ),
  rule(
    'blind-z-index-escalation',
    'Do not solve layering by blindly raising z-index',
    'visual-layering-reasoning',
    'error',
    'DESIGN.md',
    (ctx) => blindZ.test(ctx.files['DESIGN.md'] || '') && (!diagnosis.test(ctx.files['DESIGN.md'] || '') || !layerScale.test(ctx.files['DESIGN.md'] || '')),
    'Remove blind z-9999 style escalation. Diagnose the stacking context, define the layer scale, and choose a portal or top-layer strategy first.'
  ),
  rule(
    'layer-conflict-matrix-missing',
    'Complex layered UI needs a conflict matrix',
    'visual-layering-reasoning',
    'warning',
    'DESIGN.md',
    (ctx) => hasLayering(ctx) && /(modal|drawer|dropdown|tooltip|toast|sticky header|fixed header)/i.test(ctx.files['DESIGN.md'] || '') && !conflictMatrix.test(ctx.files['DESIGN.md'] || ''),
    'Add a conflict matrix for header, dropdown, drawer, modal, tooltip, toast, and global alerts.'
  )
];
