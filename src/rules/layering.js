import { rule } from './utils.js';

const terms = ['z-index', 'stacking context', 'layer', 'overlay', 'modal', 'dialog', 'popover', 'drawer', 'dropdown', 'tooltip', 'toast', 'sticky header', 'fixed header'];
const traps = ['transform', 'opacity', 'filter', 'backdrop-filter', 'perspective', 'clip-path', 'mask', 'isolation', 'contain', 'will-change', 'overflow: hidden', 'position: fixed', 'position: sticky'];

function design(ctx) {
  return ctx.files['DESIGN.md'] || '';
}

function hasAny(text, list) {
  const value = String(text || '').toLowerCase();
  return list.some((item) => value.includes(item));
}

function mentioned(text) {
  return hasAny(text, terms);
}

function missingDiagnosis(text) {
  return !hasAny(text, ['layer diagnosis', 'stacking diagnosis', 'root cause']);
}

function missingScale(text) {
  return !hasAny(text, ['layer scale', 'z-index scale', 'z-index tokens', 'layer tokens']);
}

function missingAudit(text) {
  return !hasAny(text, ['stacking context audit', 'ancestor audit', 'parent stacking context']) || !hasAny(text, traps);
}

function missingPortal(text) {
  return hasAny(text, ['modal', 'dialog', 'popover', 'drawer', 'overlay', 'tooltip', 'dropdown']) && !hasAny(text, ['portal', 'top layer', 'document body', 'overlay root']);
}

function blindEscalation(text) {
  const value = String(text || '').toLowerCase();
  const high = /z-\[?\d{4,}\]?|z-index:\s*\d{4,}/i.test(text) || value.includes('z-999');
  const reasoned = hasAny(text, ['layer scale', 'stacking context audit', 'portal', 'top layer', 'root cause']);
  return high && !reasoned;
}

function missingMatrix(text) {
  return hasAny(text, ['overlay', 'modal', 'dialog', 'popover', 'drawer', 'dropdown', 'tooltip', 'toast', 'sticky header']) && !hasAny(text, ['layer conflict matrix', 'conflict matrix', 'layer order']);
}

function gate(id, title, check, fix) {
  return rule(id, title, 'visual-layering-reasoning', 'error', 'DESIGN.md', (ctx) => {
    const text = design(ctx);
    return Boolean(text) && mentioned(text) && check(text);
  }, fix, 'manual');
}

export const layeringRules = [
  gate('layer-diagnosis-missing', 'Visual layer diagnosis is missing', missingDiagnosis, 'Add a Layer Diagnosis section that explains the root cause before changing z-index.'),
  gate('layer-scale-missing', 'Layer scale or z-index token map is missing', missingScale, 'Define a layer scale for base, sticky, dropdown, overlay, modal, toast, and critical alert layers.'),
  gate('stacking-context-audit-missing', 'Stacking context audit is missing', missingAudit, 'Audit parent stacking contexts and list transform, opacity, filter, contain, isolation, overflow, and positioned ancestors.'),
  gate('overlay-portal-policy-missing', 'Overlay portal or top-layer policy is missing', missingPortal, 'Define whether overlays render in the document body, an overlay root, native top layer, or local DOM.'),
  gate('blind-z-index-escalation', 'Blind high z-index escalation detected', blindEscalation, 'Do not solve layering bugs by raising z-index blindly. Diagnose stacking context and portal placement first.'),
  gate('layer-conflict-matrix-missing', 'Layer conflict matrix is missing', missingMatrix, 'Add an overlay order matrix covering header, nav, dropdown, modal, drawer, tooltip, toast, and global alert conflicts.')
];
