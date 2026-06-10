# QA Checklist

## Pre-design gates

- [ ] Mode classified: fresh-seed, existing-scan, redesign, implementation, audit, or amplify.
- [ ] Intake session completed and written to `INTAKE.session.md`.
- [ ] Claude extracted all inferable context before asking questions.
- [ ] No more than 7 intake questions were asked.
- [ ] `PRODUCT.md` exists and contains strategy, not visual tokens.
- [ ] 2026 Standards Search Gate completed or marked as bundled-references-only.
- [ ] `STANDARDS.search-notes.md` exists.
- [ ] `npx impeccable skills install` was attempted or documented as unavailable.

## DESIGN.md gates

- [ ] Exactly six top-level sections exist.
- [ ] Overview includes Creative North Star.
- [ ] Overview includes Intake Session Gate.
- [ ] Overview includes 2026 Standards Gate.
- [ ] Overview includes Rules Engine Gate.
- [ ] Overview includes Impeccable setup gate with `npx impeccable skills install`.
- [ ] Colors use semantic tokens with hex values.
- [ ] Typography covers Arabic, English, and numbers when relevant.
- [ ] Elevation covers focus, overlays, disabled, loading, and interaction states.
- [ ] Components include purpose, anatomy, variants, states, and accessibility.
- [ ] Do's and Don'ts ban AI-looking UI defaults.

## Non-negotiable interface checks

- [ ] Contrast rules are explicit.
- [ ] Focus states are visible.
- [ ] Keyboard and target-size rules exist.
- [ ] Arabic is fully RTL when relevant.
- [ ] English is fully LTR when relevant.
- [ ] Mixed-language rules exist.
- [ ] Sparkle, magic, robot, and emoji UI icons are banned.
- [ ] Native `alert()`, `confirm()`, and `prompt()` are banned.
- [ ] In-app popup and feedback system is specified.
- [ ] Responsive behavior covers mobile, tablet, desktop, and wide screens.
- [ ] UX-CRX logic exists for primary action, secondary action, decision point, and recovery path.

## Scripts

Run before implementation:

```bash
node scripts/validate-design-md.mjs DESIGN.md
node scripts/score-design-md.mjs DESIGN.md PRODUCT.md
node scripts/run-gates.mjs DESIGN.md PRODUCT.md src
```

Run before final handoff:

```bash
node scripts/scan-ui-implementation.mjs src
node scripts/scan-viewport-fit.mjs http://localhost:3000
npx impeccable detect src/
```

## Viewport QA

- [ ] Every route has a Page Viewport Contract in DESIGN.md.
- [ ] Auth pages have no visible vertical scroll at normal content size.
- [ ] Auth pages still recover safely when errors, keyboard, zoom, or long localized text appears.
- [ ] No horizontal document scroll at 320, 360, 390, 414, 768, 1024, 1280, and 1440 widths.
- [ ] No blanket `overflow: hidden` on root layout containers (`html`, `body`, `#root`, `main`, page shells).
- [ ] No `100vw` padded wrappers.
- [ ] No blind `height: 100vh` on content-heavy shells without documented internal scroll owner.
- [ ] Full-screen pages use `min-block-size: 100dvh` with `100vh` fallback.
- [ ] Height-based responsive behavior was tested at 568, 640, 720, 800, and 900px heights.
- [ ] Auth card widths use fluid sizing: `inline-size: min(100%, 420px)` or equivalent.
- [ ] Decorative elements do not extend outside the viewport without clipping inside their own layer.

## Modal QA

- [ ] Every modal has a declared modal contract (type, scroll owner, background behavior, focus behavior, viewport behavior).
- [ ] No background interaction while the modal is open.
- [ ] No background scroll while the modal is open.
- [ ] Scroll position is preserved and restored on modal close.
- [ ] Scrollbar gutter does not cause layout shift on modal open/close.
- [ ] Keyboard focus stays inside the modal (Tab/Shift+Tab trapped).
- [ ] Escape behavior is defined and works.
- [ ] Focus returns to the trigger element after close.
- [ ] Modal sizes safely: `max-inline-size: min(calc(100vw - 32px), [max])` and `max-block-size: calc(100dvh - 32px)`.
- [ ] No horizontal overflow at 320, 360, 390, 414, 768, 1024, 1280, 1440px widths.
- [ ] No vertical overflow outside the modal at 568, 640, 720, 800, 900px heights.
- [ ] Modal content remains reachable at small heights.
- [ ] When modal content overflows, the modal body scrolls internally; header/footer remain fixed.
- [ ] Close button has sufficient target size (44x44 preferred, 24x24 minimum) and accessible label.
- [ ] Modal has an accessible name via `aria-labelledby` or `aria-label`.
- [ ] Form fields have visible persistent labels; placeholder is not the only label.
- [ ] Placeholder text is readable and does not look disabled.
- [ ] Focus, hover, error, disabled, loading, and success states exist for all interactive elements.
- [ ] Mixed Arabic and English text is visually stable; English tokens isolated with `<bdi>` or directional spans.
- [ ] Backdrop does not make the interface look frozen; background CTAs do not compete with modal CTA.
- [ ] Modal copy is task-based, short, and uses action verbs.
- [ ] Loading state prevents duplicate submission.

## Dashboard Shell QA

- [ ] Dashboard uses a declared grid layout with sidebar column and main column.
- [ ] Main content calculates available width after sidebar; content does not slide under sidebar.
- [ ] Sidebar scrolls internally; main content scrolls internally; document body does not scroll.
- [ ] Tables scroll horizontally inside their container, not at page level.
- [ ] Floating widgets do not cover primary actions, tables, or navigation.
- [ ] Auth pages follow action hierarchy: one dominant CTA, social login visually secondary, legal copy compact.
- [ ] Auth pages fit normal viewport without scroll; legal copy does not create scroll pressure.
- [ ] Every form field has a visible persistent label, not just a placeholder.

## Overlay Stack QA

- [ ] No ad-hoc `position: fixed` overlays in page components; all overlays come from centralized system.
- [ ] No manual toast construction in page files; all toasts use centralized Toast System.
- [ ] Toast placement is collision-aware; toast does not cover tables, CTAs, tour panels, or sidebars.
- [ ] Toast has solid or near-solid background; text contrast passes 4.5:1 minimum.
- [ ] Maximum visible toasts: 1 on mobile, 2 on desktop; additional toasts queued.
- [ ] Toast auto-dismiss minimum 5 seconds; timers pause on hover/focus.
- [ ] Guided tour panels do not cover tables, forms, or CTAs.
- [ ] Guided tour becomes bottom sheet or full-width panel on small screens.
- [ ] Tour and toast collision is handled.
- [ ] Every overlay declares z-index token from shared scale, not magic numbers.
- [ ] Sensitive actions (API key creation) do not use toast as only feedback; use modal or inline result.

## Sensitive Data QA

- [ ] API keys, tokens, and secrets are masked by default in tables and cards.
- [ ] Masking shows prefix and last 4 characters only.
- [ ] Every masked token has a copy button with visible feedback.
- [ ] Reveal action is temporary (auto-mask after 10-30 seconds).
- [ ] New secrets are shown once in a secure result modal after creation, with copy button and warning.
- [ ] After closing creation modal, secret appears masked in all subsequent views.
- [ ] Delete, revoke, and rotate actions require explicit confirmation modal.
- [ ] Token prefixes are wrapped in `<bdi>` or use `dir="ltr"` in Arabic interfaces.
