import { rule } from './utils.js';

const TERMS = ['modal', 'dialog', 'popup', 'popover', 'drawer', 'sheet', 'overlay', 'lightbox'];

function designText(ctx) {
  return ctx.files['DESIGN.md'] || '';
}

function hasAny(text, terms) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function overlayMentioned(text) {
  return hasAny(text, TERMS);
}

function missingViewportContract(text) {
  return !hasAny(text, ['viewport contract', 'viewport fit', 'modal viewport', 'popup viewport', 'overlay viewport']);
}

function missingSizing(text) {
  return !hasAny(text, ['max-width', 'max-w-', 'width: min', 'clamp(']) || !hasAny(text, ['max-height', 'max-h-', '100dvh', '100svh']);
}

function missingScroll(text) {
  return !hasAny(text, ['overflow-y-auto', 'overflow-auto', 'overflow-y: auto', 'overflow: auto', 'internal scroll', 'modal body scroll', 'overscroll-contain']);
}

function missingMobile(text) {
  const hasMobileScope = hasAny(text, ['mobile', 'under 768', 'small viewport', 'sm:']);
  const hasMobileBehavior = hasAny(text, ['bottom sheet', 'full-screen', 'full screen', 'w-full', 'safe-area', '100dvh', 'max-h-']);
  return !(hasMobileScope && hasMobileBehavior);
}

function missingProof(text) {
  return !hasAny(text, ['320x568', '375x667', '390x844', 'landscape', 'keyboard', 'visual viewport', 'no clipping', 'no viewport overflow', 'no horizontal overflow']);
}

function unsafeFixedSizing(text) {
  const lower = text.toLowerCase();
  const warned = lower.includes('avoid height: 100vh') || lower.includes('do not use height: 100vh');
  const risky = lower.includes('height: 100vh') || lower.includes('h-screen') || lower.includes('min-h-screen') || /width:\s*\d{3,}px/i.test(text) || /height:\s*\d{3,}px/i.test(text);
  return risky && !warned && !(!missingSizing(text) && !missingScroll(text));
}

function overlayRule(id, title, check, fix) {
  return rule(id, title, 'modal-viewport-governance', 'error', 'DESIGN.md', (ctx) => {
    const text = designText(ctx);
    return Boolean(text) && overlayMentioned(text) && check(text);
  }, fix, 'manual');
}

export const modalViewportRules = [
  overlayRule('modal-viewport-contract-missing', 'Modal and popup viewport contract is missing', missingViewportContract, 'Add a strict modal and popup viewport contract before implementation.'),
  overlayRule('modal-sizing-constraints-missing', 'Modal and popup max-width or max-height constraints are missing', missingSizing, 'Define max-width and max-height using viewport-safe constraints.'),
  overlayRule('modal-scroll-strategy-missing', 'Modal and popup internal scroll strategy is missing', missingScroll, 'Define internal scrolling for long overlay content.'),
  overlayRule('modal-mobile-fit-missing', 'Modal and popup mobile viewport behavior is missing', missingMobile, 'Define mobile behavior under 768px, such as full-screen, bottom sheet, or w-full centered overlay.'),
  overlayRule('modal-fixed-size-viewport-risk', 'Modal and popup uses unsafe fixed viewport sizing', unsafeFixedSizing, 'Remove unsafe fixed modal sizing or protect it with max-size constraints, internal scroll, and mobile behavior.'),
  overlayRule('modal-viewport-qa-proof-missing', 'Modal and popup viewport QA proof is missing', missingProof, 'Add proof for 320x568, 375x667, 390x844, landscape, and keyboard-open states with no clipping or viewport overflow.')
];
