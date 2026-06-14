import { rule } from './utils.js';

const overlayTerms = /\b(modal|dialog|popup|popover|drawer|sheet|overlay|lightbox|command palette)\b/i;
const viewportContract = /viewport contract|visual viewport|screen fit|fit inside|no clipping|no viewport overflow|safe area/i;
const widthGuard = /max-w-|max-width|width:\s*min\(|w-\[min\(|clamp\(|inset-x-|mx-\d|m-\d/i;
const heightGuard = /max-h-|max-height|100dvh|100svh|dvh|svh|h-\[min\(|height:\s*min\(|clamp\(/i;
const scrollGuard = /overflow-y-auto|overflow-y-scroll|overflow-auto|overflow-scroll|overscroll-contain|internal scroll|scrollable body|modal body scroll/i;
const scrollAestheticGuard = /scrollbar-hide|no visible scrollbar|hidden scrollbar|hide scrollbar|scrollbar-none|thin scrollbar|custom scrollbar|scroll shadow|fade affordance|scroll affordance|gradient fade|body pane scroll|content pane scroll/i;
const mobileGuard = /mobile|under 768|sm:|max-sm|bottom sheet|full-screen|full screen|w-full|safe-area|keyboard/i;
const qaGuard = /320x568|375x667|390x844|landscape|keyboard-open|keyboard open|no horizontal overflow|viewport qa|no clipping/i;
const riskyFixed = /height:\s*100vh|h-screen|w-\[\d{3,}px\]|width:\s*\d{3,}px|height:\s*\d{3,}px/i;
const exposedScrollbarRisk = /visible scrollbar|native scrollbar|scrollbar always visible|browser scrollbar|shell scrollbar|modal shell scroll/i;

function designDoc(ctx) {
  return ctx.files['DESIGN.md'] || '';
}

function hasOverlay(ctx) {
  return overlayTerms.test(designDoc(ctx));
}

export const modalViewportRules = [
  rule(
    'modal-viewport-contract-missing',
    'Modal, popup, drawer, or overlay needs an explicit viewport contract',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && !viewportContract.test(designDoc(ctx)),
    'Add a viewport contract that proves the overlay fits inside the visual viewport on mobile, desktop, landscape, and keyboard-open states.'
  ),
  rule(
    'modal-width-guard-missing',
    'Overlay needs max-width or dynamic width guard',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && !widthGuard.test(designDoc(ctx)),
    'Define max-width, width:min(...), clamp(...), inset spacing, or equivalent responsive width rules for every overlay shell.'
  ),
  rule(
    'modal-height-guard-missing',
    'Overlay needs max-height or dynamic viewport height guard',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && !heightGuard.test(designDoc(ctx)),
    'Define max-height using dynamic viewport units such as 100dvh or 100svh, or an equivalent bounded height rule.'
  ),
  rule(
    'modal-internal-scroll-missing',
    'Long overlay content needs internal scroll behavior',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && !scrollGuard.test(designDoc(ctx)),
    'Add overflow-y-auto, overflow-auto, overscroll-contain, or a documented scrollable modal body area.'
  ),
  rule(
    'modal-scrollbar-aesthetic-missing',
    'Scrollable overlays need a no-heavy-scrollbar treatment',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && scrollGuard.test(designDoc(ctx)) && !scrollAestheticGuard.test(designDoc(ctx)),
    'Keep long overlays scrollable without exposing a heavy native scrollbar on the modal shell. Use a scrollable body pane with hidden/thin/custom scrollbar treatment plus a clear scroll affordance such as a fade or scroll shadow.'
  ),
  rule(
    'modal-shell-scrollbar-risk',
    'Overlay appears to scroll the shell or expose a native scrollbar',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && exposedScrollbarRisk.test(designDoc(ctx)) && !scrollAestheticGuard.test(designDoc(ctx)),
    'Do not let the modal shell expose a large native scrollbar. Keep the shell fixed inside the viewport and scroll only the content pane with a restrained scrollbar treatment.'
  ),
  rule(
    'modal-mobile-behavior-missing',
    'Overlay needs explicit mobile behavior',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && !mobileGuard.test(designDoc(ctx)),
    'Specify mobile behavior under 768px: full-screen, bottom sheet, or bounded centered modal with safe margins.'
  ),
  rule(
    'modal-viewport-qa-missing',
    'Overlay needs viewport QA proof',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && !qaGuard.test(designDoc(ctx)),
    'Add QA proof for 320x568, 375x667, 390x844, landscape, keyboard-open state, no clipping, and no horizontal overflow.'
  ),
  rule(
    'modal-fixed-size-risk',
    'Overlay uses risky fixed viewport or pixel sizing',
    'modal-viewport-governance',
    'error',
    'DESIGN.md',
    (ctx) => hasOverlay(ctx) && riskyFixed.test(designDoc(ctx)) && !viewportContract.test(designDoc(ctx)),
    'Replace height:100vh, h-screen, or raw fixed pixel shell sizes with bounded dynamic viewport sizing and a viewport contract.'
  )
];
