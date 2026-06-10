# Overlay System Rules Reference

## Purpose

This file defines the rules for every floating, layered, or overlay UI element. The core principle: the agent must never build ad-hoc overlays inside page components. All overlays must come from a centralized system.

## No Ad-hoc Overlay Rule

The agent must never create floating UI elements directly inside page components.

This applies to: toast, snackbar, tooltip, popover, dropdown, modal, guided tour, bottom sheet, floating assistant, and sticky CTA.

All overlays must be rendered through the centralized Overlay System.

Required overlay system features:

- Shared z-index tokens
- Safe area registry
- Collision detection
- Queueing
- RTL-aware placement
- Accessibility labels
- Keyboard behavior
- Contrast tokens
- Viewport tests

Any custom `position: fixed` or high `z-index` overlay inside a page component is a blocker.

## Overlay Stack Contract

Before adding any floating element, the agent must declare its overlay type and behavior.

Required declaration per overlay:

- z-index token (from the shared scale, not a magic number)
- Placement strategy
- Collision behavior (what happens when it overlaps another overlay or critical content)
- Close behavior
- Focus behavior
- Whether it can coexist with other overlays
- Whether it blocks background interaction

Recommended z-index token scale:

```css
:root {
  --z-base: 0;
  --z-sticky: 100;
  --z-dropdown: 300;
  --z-popover: 400;
  --z-toast: 700;
  --z-tour: 800;
  --z-modal-backdrop: 900;
  --z-modal: 1000;
}
```

Implementation is blocked if multiple overlays can overlap primary content without collision handling.

## Toast Construction Ban

The agent must never create a toast, snackbar, alert banner, or floating notification manually inside a page component.

Forbidden:

- `position: fixed` toast inside page files
- Bottom-left or bottom-right hardcoded toast placement
- Custom success message divs floating over content
- Transparent or glass toast backgrounds
- Toast z-index values written directly inside page code
- Toast placement without collision handling
- Toast over tables, CTAs, guided panels, sidebars, or forms

Required:

All notifications must be triggered only through the centralized Toast System:

- `toast.success(message, options)`
- `toast.error(message, options)`
- `toast.warning(message, options)`
- `toast.info(message, options)`

The only allowed rendering location is `ToastViewport` (or the equivalent centralized toast region in the project's component system).

## Toast Safe Placement Algorithm

Toast placement must be calculated from layout context, not hardcoded.

Default placement:

- Desktop LTR: bottom-right
- Desktop RTL: bottom-left, only if it does not collide with sidebar, tour panel, table actions, or sticky controls
- Mobile: bottom-center or top-center depending on bottom navigation presence
- Dashboard with right sidebar: avoid sidebar zone
- Guided tour active: move toast away from tour panel
- Modal active: do not show non-critical toasts above the modal unless attached to modal flow

Toast must avoid:

- Primary CTAs
- Table row actions
- Sticky footers
- Guided tour panels
- Sidebars
- Bottom sheets
- Modals
- Payment or action confirmation areas

## Layout Safe Area Registry

Every dashboard shell and complex layout must expose reserved UI zones to the overlay system.

Required reserved zones:

- Sidebar
- Sticky navigation
- Guided tour panel
- Table action area
- Bottom navigation
- Sticky CTA
- Modal or drawer when active

ToastViewport must read these zones before choosing placement.

Implementation is blocked if toast placement is hardcoded without reading layout safe areas.

## Feedback Pattern Selection

The agent must not use toast as the default feedback pattern.

Use toast only for:

- Low-risk success messages ("تم النسخ", "تم الحفظ")
- Background completion notices
- Copy confirmation
- Non-blocking updates

Use inline feedback for:

- Form validation
- Field-level errors
- Save state inside a form
- Table row actions

Use status banner for:

- Page-level warning
- Connection status
- Payment state
- Failed integration

Use modal or secure result panel for:

- Generated API keys
- Irreversible actions
- Payment confirmation
- Credential creation
- Destructive actions

Implementation is blocked if a sensitive or critical action uses only a toast as feedback.

## Toast Contrast Rules

Toast visuals must use approved tokens only.

Required:

- Toast background must be solid or near-solid, not transparent glass.
- Toast text contrast must pass 4.5:1 minimum.
- Icons and borders must pass 3:1 minimum against adjacent colors.
- Success toast must not rely on green alone.
- Error toast must not rely on red alone.
- Toast must remain readable over any page background.
- Toast must have a shadow or surface separation token.

Forbidden:

- White text over translucent white or green backgrounds.
- Glassmorphism toast over busy dashboards.
- Low-opacity toast backgrounds.
- Text-shadow as a substitute for real contrast.

## Toast Queue Rules

- Maximum visible toasts: 1 on mobile, 2 on desktop.
- Additional toasts must be queued, not stacked.
- Critical errors can replace lower-priority toasts.
- Success toasts should auto-dismiss after a safe duration.
- Minimum auto-dismiss timeout: 5 seconds for accessibility.
- Timers must pause on hover, focus, and page blur.
- Toast region must be an ARIA landmark with an accessible name (e.g., "Notifications").
- Each toast should be a non-modal alert dialog with a close button.

## Toast Collision Rules

Toasts must never cover:

- Primary CTA
- Form submit button
- Table row actions
- Navigation
- Guided tour panel
- Critical system feedback
- Payment or API generation states

Required:

- Toasts must use a safe area calculated from the layout.
- Toasts must have strong readable contrast.
- Toasts must have success, warning, error, info variants.
- Toasts must auto-dismiss only when non-critical.
- Critical toasts must provide a visible close action.
- If a guided tour panel is open, toast placement must move to a non-conflicting zone.

Forbidden:

- Toast over table actions.
- Toast over sticky CTA.
- Toast with transparent or low-contrast background.
- Toast text that disappears into the page.

## Guided Tour Panel Rules

Guided tour panels must not behave like random floating cards.

Required:

- Guided tour must reserve or avoid primary content areas.
- The panel must avoid covering tables, forms, and CTAs.
- The panel must have a clear close button with sufficient target size.
- Step navigation buttons must meet target-size rules (44x44 preferred, 24x24 minimum).
- Active step must be visually clear.
- On small screens, the tour must become a bottom sheet or full-width panel.
- Tour and toast collision must be handled.

Forbidden:

- Guided panel covering table content.
- Guided panel covering submit buttons.
- Guided panel overlapping toast.
- Guided panel without mobile fallback.

## Overlay Collision Testing

Every dashboard with overlay feedback must include automated collision testing.

The test must fail if an overlay (toast, tour, popover) overlaps:

- Primary CTA
- Table action column
- Guided tour panel
- Modal
- Sidebar navigation
- Sticky footer
- Payment or API key result area

Use bounding box intersection checks in Playwright or equivalent:

```js
function boxesOverlap(a, b) {
  if (!a || !b) return false;
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}
```

## Technical references

- Radix UI Toast: centralized ToastProvider and ToastViewport pattern
- React Aria Toast: queue-based toast region with ARIA landmark and auto-dismiss
- Material Design Snackbar: placement avoidance of touch targets and navigation
- WCAG 2.2 Contrast Minimum (1.4.3): text contrast 4.5:1
- WCAG 2.2 Non-text Contrast (1.4.11): control and state contrast 3:1

---

## Popup and Floating Element Positioning (Gate 23)

This section covers popovers, dropdowns, tooltips, comboboxes, date pickers, and context menus. These are smaller than modals and position themselves relative to a trigger element. They follow different rules from modals.

### Required positioning strategy

Every product with floating elements must declare one strategy in `DESIGN.md`. The absence of a declared strategy is a Gate 23 blocker.

**Strategy A: CSS Anchor Positioning (native, 2025+)**

Use when targeting modern browsers and the stack has no existing floating library.

```css
.trigger {
  anchor-name: --trigger;
}
.popup {
  position: absolute;
  position-anchor: --trigger;
  inset-block-start: anchor(--trigger bottom);
  inset-inline-start: anchor(--trigger start);
  position-try-fallbacks: --above-trigger;
}
@position-try --above-trigger {
  inset-block-start: auto;
  inset-block-end: anchor(--trigger top);
}
```

**Strategy B: Floating UI (JavaScript, recommended for React/Vue)**

Required middleware configuration:

```javascript
computePosition(triggerEl, floatingEl, {
  placement: 'bottom-start',
  middleware: [
    flip(),
    shift({ padding: 8 }),
    size({
      apply({ availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          maxHeight: `${Math.min(availableHeight - 8, MAX_HEIGHT)}px`,
          overflowY: 'auto',
        });
      },
    }),
  ],
});
```

`flip()` is mandatory. Disabling flip for aesthetic reasons is a Gate 23 failure.

**Strategy C: CSS clamp (simple, short dropdowns only)**

Use only when the trigger is always in the top half of the page and content height is predictable and short.

```css
.dropdown {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  max-block-size: 40vh;
  overflow-y: auto;
  max-inline-size: min(280px, calc(100vw - 16px));
}
```

No automatic flip. If the trigger can appear near the bottom of the page, use Strategy A or B instead.

### Portal mounting rule

Floating elements that need to visually escape their parent container must be mounted outside that container.

- React: `createPortal(floatingEl, document.body)`
- Vue: `<Teleport to="body">`
- Plain HTML: `document.body.appendChild(floatingEl)`

The agent must never build a floating element inside a container that has `overflow: hidden` or `overflow: clip` without portal mounting. This is the most common cause of clipped dropdowns.

### Required z-index token scale

```css
:root {
  --z-base:     0;
  --z-raised:   10;
  --z-sticky:   100;
  --z-dropdown: 200;
  --z-tooltip:  300;
  --z-modal:    400;
  --z-toast:    500;
  --z-top:      9999;
}
```

Every floating element must use a token from this scale. Magic numbers are forbidden.

### Forbidden popup patterns

```css
/* WRONG: hardcoded direction, no flip */
.dropdown { position: absolute; top: 100%; left: 0; }

/* WRONG: fixed height, no internal scroll */
.datepicker { height: 320px; }

/* WRONG: low z-index, hidden under sticky header */
.tooltip { z-index: 10; }
```

### Gate 23 QA checklist

- Dropdown opens in the opposite direction when not enough space in the default direction.
- Dropdown does not extend past any viewport edge at any test viewport.
- Dropdown is not clipped by a parent with `overflow: hidden`.
- Dropdown z-index is above sticky headers.
- Date picker caps height at available space with internal scroll.
- All floating elements use z-index tokens.
- All escaping floating elements use portal mounting.
