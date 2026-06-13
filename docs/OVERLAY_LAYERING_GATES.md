# Overlay Viewport and Stacking Gates

This guide documents the strict gates that block common AI-generated overlay failures before frontend code is written.

## Problem

AI coding agents often create modals, dialogs, drawers, popovers, dropdowns, and toasts that look correct in one screenshot but fail in real screens. Common failures include:

- The popup is wider than the mobile viewport.
- The modal height exceeds the screen and cannot scroll.
- Content is clipped by a parent with overflow hidden.
- The overlay appears below a sticky header.
- The agent fixes a visual conflict by only raising layer values.
- Keyboard-open mobile states are not considered.

## Modal viewport contract

When `DESIGN.md` mentions a modal, dialog, popup, drawer, sheet, overlay, lightbox, popover, or command palette, the audit expects a written viewport contract.

The contract must include:

- Width guard: `max-width`, `max-w`, `width: min(...)`, `clamp(...)`, inset spacing, or an equivalent dynamic width rule.
- Height guard: `max-height`, `max-h`, `100dvh`, `100svh`, or an equivalent bounded dynamic height rule.
- Internal scroll: `overflow-y-auto`, `overflow-auto`, `overscroll-contain`, or a documented scrollable body area.
- Mobile behavior: full-screen, bottom sheet, or bounded centered modal with safe margins under 768px.
- QA proof: 320x568, 375x667, 390x844, landscape, keyboard-open state, no clipping, and no horizontal overflow.

## Stacking reasoning v2

Layered UI such as sticky headers, fixed headers, modals, drawers, dropdowns, tooltips, popovers, and toasts must include a reasoning plan before implementation.

The plan must cover:

- Placement plan: what must appear above what, and why.
- Stacking context audit: ancestors that use `transform`, `opacity`, `filter`, `contain`, `isolation`, `will-change`, overflow clipping, fixed positioning, or sticky positioning.
- Layer scale: named layer tokens for base content, sticky headers, dropdowns, drawers, modals, toasts, and alerts.
- Portal policy: whether the overlay renders in local DOM, a portal root, document body, native dialog top layer, or another overlay root.
- Conflict matrix: header vs dropdown, drawer vs modal, tooltip vs modal, toast vs modal, and global alert vs every overlay.

## What the agent must not do

Do not treat an overlay bug as a simple number problem. Raising layer values without a root-cause plan is usually a symptom fix, not a root fix.

The correct sequence is:

1. Diagnose the placement problem.
2. Check viewport and scroll constraints.
3. Check ancestors that can clip or isolate the layer.
4. Choose local DOM, overlay root, native top layer, or portal.
5. Apply the smallest layer value from the project layer scale.
6. Verify mobile, landscape, and keyboard-open states.

## Related rules

- `modal-viewport-contract-missing`
- `modal-width-guard-missing`
- `modal-height-guard-missing`
- `modal-internal-scroll-missing`
- `modal-mobile-behavior-missing`
- `modal-viewport-qa-missing`
- `modal-fixed-size-risk`
- `stacking-plan-missing`
- `stacking-context-audit-missing`
- `layer-scale-missing`
- `overlay-portal-policy-missing`
- `blind-z-index-escalation`
- `layer-conflict-matrix-missing`
