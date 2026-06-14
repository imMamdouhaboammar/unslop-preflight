# Overlay Viewport and Stacking Gates

This guide documents the strict gates that block common AI-generated overlay failures before frontend code is written.

## Problem

AI coding agents often create modals, dialogs, drawers, popovers, dropdowns, tooltips, and toasts that look correct in one screenshot but fail in real screens.

Common failures include:

- The popup is wider than the mobile viewport.
- The modal height exceeds the screen and cannot scroll.
- The modal uses a large visible native scrollbar that makes the UI feel unfinished.
- Content is clipped by a parent with `overflow: hidden` or a scroll container.
- The overlay appears below a sticky header.
- A tooltip or dropdown is trapped by a transformed parent.
- The agent fixes a visual conflict by only raising layer values.
- Keyboard-open mobile states are not considered.
- Landscape viewport is ignored.

## Modal viewport contract

When `DESIGN.md` mentions a modal, dialog, popup, drawer, sheet, overlay, lightbox, popover, toast, or command palette, the audit expects a written viewport contract.

The contract must include:

- Width guard: `max-width`, `max-w`, `width: min(...)`, `clamp(...)`, inset spacing, or an equivalent dynamic width rule.
- Height guard: `max-height`, `max-h`, `100dvh`, `100svh`, or an equivalent bounded dynamic height rule.
- Internal scroll: `overflow-y-auto`, `overflow-auto`, `overscroll-contain`, or a documented scrollable body area.
- Scrollbar treatment: long overlays must not expose a heavy native scrollbar on the modal shell. Prefer a scrollable body pane with hidden, thin, or custom scrollbar treatment plus a visible affordance such as a fade or scroll shadow.
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

## Portal policy

The design should state where each overlay renders.

| Policy | Use when | Risk |
|--------|----------|------|
| local DOM | The layer must stay inside a component boundary | Can be clipped by parents |
| portal root | The layer must escape local layout and stacking traps | Needs focus and scroll handling |
| document body | Global overlay or application shell layer | Needs consistent layer tokens |
| native top layer | Native dialog or popover is appropriate | Needs browser behavior review |

Do not leave portal policy implicit for modals, command palettes, drawers, dropdowns, or popovers.

## Layer scale

Use named layer tokens instead of arbitrary high values.

A typical scale may include:

- base content
- raised card
- sticky header
- dropdown
- popover
- drawer
- modal
- toast
- global alert

The exact values can vary by project. The important part is that the hierarchy is named and intentional.

## Conflict matrix

A useful `DESIGN.md` should answer these conflicts before implementation:

- header vs dropdown
- header vs modal
- drawer vs modal
- tooltip vs modal
- toast vs modal
- global alert vs every overlay
- command palette vs toast
- mobile bottom sheet vs sticky navigation

## What the agent must not do

Do not treat an overlay bug as a simple number problem. Raising layer values without a root-cause plan is usually a symptom fix, not a root fix.

Do not solve long modals by exposing a thick native scrollbar on the shell. The scroll behavior belongs inside a bounded content pane with a restrained visual treatment and a clear scroll affordance.

The correct sequence is:

1. Diagnose the placement problem.
2. Check viewport and scroll constraints.
3. Check ancestors that can clip or isolate the layer.
4. Choose local DOM, overlay root, native top layer, or portal.
5. Apply the smallest layer value from the project layer scale.
6. Verify mobile, landscape, keyboard-open, and conflict states.

## Passing handoff example

```text
Modal viewport contract: modal width uses min(92vw, 640px), body max-height uses calc(100dvh - 32px), content scrolls inside modal body with a hidden/thin scrollbar treatment and a bottom fade affordance. Mobile under 768px becomes full-screen with safe padding. QA: checked 320x568, 375x667, 390x844, landscape, keyboard-open state, no clipping, no horizontal overflow.

Stacking plan: modal renders in overlay root, header remains below modal layer, toast remains above modal only for critical messages. Ancestors with transform/overflow are not allowed to contain the modal. Layer scale: header < dropdown < drawer < modal < critical toast.
```

## Related rules

- `modal-viewport-contract-missing`
- `modal-width-guard-missing`
- `modal-height-guard-missing`
- `modal-internal-scroll-missing`
- `modal-scrollbar-aesthetic-missing`
- `modal-shell-scrollbar-risk`
- `modal-mobile-behavior-missing`
- `modal-viewport-qa-missing`
- `modal-fixed-size-risk`
- `stacking-plan-missing`
- `stacking-context-audit-missing`
- `layer-scale-missing`
- `overlay-portal-policy-missing`
- `blind-z-index-escalation`
- `layer-conflict-matrix-missing`
