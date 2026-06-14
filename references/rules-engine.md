# Strict Rules Engine

## Purpose

This file defines blocking gates for `PRODUCT.md`, `DESIGN.md`, amplified design files, and implementation scans.

A failed gate means the agent must repair the artifact before moving to frontend code.

## Gate levels

- `blocker`: must be fixed before implementation.
- `major`: must be fixed before final handoff.
- `minor`: may be fixed during implementation if documented.

## Gate 0: Intake completeness

Blockers:

- No `INTAKE.session.md` or no intake summary.
- Missing product category, user, job, primary action, language direction, or product surface.
- More than 7 questions asked in a single intake round.
- Questions asked for information already inferable from provided context.

## Gate 1: Product context

Blockers:

- Missing `PRODUCT.md`.
- `PRODUCT.md` contains style tokens instead of strategy.
- No clear user, job, promise, risk, anti-reference, or success criteria.

## Gate 2: Standards search

Blockers:

- No standards gate note in `DESIGN.md`.
- No source status recorded.
- Uses stale or unsupported assumptions for accessibility, browser support, or framework behavior.

## Gate 3: Unslop setup

Blockers:

- `DESIGN.md` does not include `npx unslop skills install`.
- Implementation prompt does not tell the coding agent to attempt Unslop setup.

## Gate 4: Six-section design contract

Blockers:

- `DESIGN.md` has missing or extra top-level sections.
- The six sections are not: Overview, Colors, Typography, Elevation, Components, Do's and Don'ts.

## Gate 5: Contrast and accessibility

Blockers:

- No explicit contrast minimums.
- No focus state rules.
- No keyboard or target-size rules.
- Text over images, gradients, blur, or glass without contrast rule.
- Error states do not explain recovery.

## Gate 6: Directionality

Blockers:

- Arabic UI not fully RTL.
- English UI not fully LTR.
- Uses `text-align: right` as a substitute for RTL layout.
- No mixed-language handling.
- Directional icons are not governed.

## Gate 7: AI visual slop

Blockers:

- Generic purple to blue gradients as identity.
- Sparkle, magic wand, starburst, generic AI robot, or emoji-based UI icons.
- Card grid with no hierarchy or product logic.
- Decorative glass, neon, blobs, halos, or floating ornaments without product reason.

## Gate 8: UX-CRX logic

Blockers:

- No primary action per screen.
- No recovery path.
- Conversion surface does not reduce anxiety or clarify tradeoffs.
- Unmanaged stacking of cards, sections, CTAs, filters, or panels.

## Gate 9: Responsive and mobile

Blockers:

- No mobile contract.
- Desktop simply stacked on mobile without redesign.
- Sticky UI hides actions or form fields.
- Horizontal scroll outside intentional data tables.

## Gate 10: Popup and feedback system

Blockers:

- Uses `alert()`, `confirm()`, or `prompt()` for product flows.
- No in-app feedback system.
- Destructive actions lack confirmation or undo strategy.

## Gate 11: Component contract

Blockers:

- Components lack purpose, anatomy, variants, states, accessibility, and what-not-to-do rules.
- Buttons, inputs, cards, navigation, tables/lists, empty states, loading states, and feedback states are missing.

## Gate 12: Implementation scan

Blockers:

- Source contains native browser popups.
- Source contains obvious sparkle or emoji icons in product UI.
- Source contains undocumented gradients or visual tokens outside `DESIGN.md`.

## Gate 13: Amplify preservation

Blockers:

- Old useful project-specific decisions removed without reason.
- No amplification report.
- Amplified file does not explain legacy handling.

## Gate 14: Semantic HTML and interaction integrity

Source: 2026 accessibility audits of AI-generated UI (see `ai-failure-patterns.md` section A).

Blockers:

- Interactive elements built as `<div onClick>` or `<span onClick>` instead of `<button>` or `<a>`.
- Click handlers without keyboard operability (no Enter/Space path) on custom controls.
- Icon-only or icon controls with no accessible name; decorative icons without `aria-hidden`.
- Missing landmarks (`header`, `nav`, `main`, `footer`) or missing/disordered heading hierarchy.
- `DESIGN.md` does not require semantic HTML, keyboard operability, and labeled icons in its component contracts.

## Gate 15: Realistic content (no placeholder slop)

Source: practitioner reports that fake data hides layout truth (see `ai-failure-patterns.md` C2).

Blockers:

- `DESIGN.md` or implementation relies on `Lorem ipsum`, `John Doe`, `user@example.com`, `Item 1/2/3`, placeholder avatars, or fake metrics as shipped content.
- No requirement to use realistic content whose length and magnitude stress the layout.
- Disappearing placeholder used as the only label.

## Gate 16: Design tokens, not hardcoded values

Source: production-grade reviews of AI output (see `ai-failure-patterns.md` E1).

Blockers:

- Implementation contains raw hex colors, fixed pixel paddings, or magic numbers outside the documented token set.
- `DESIGN.md` does not define color, spacing, radius, and type tokens with named roles.

Major:

- Hardcoded default framework accent (for example indigo) used as the brand.
- Single default body font reused with no brand justification.

## Gate 17: Drift control (single source of truth)

Source: spec-adherence and context-drift reports in long agent sessions (see `ai-failure-patterns.md` E2, E3, E4).

Blockers:

- Binding decisions live only in prose, with no compact token table and component list to anchor them.
- Implementation prompt does not name `DESIGN.md` as the single source of truth, or does not forbid inventing tokens.
- No instruction to re-point the agent at `DESIGN.md` and re-run gates before each UI merge.
- Destructive or schema-level auto-fixes allowed without a confirmation surface and a stated diff.

## Severity note for amplified or pre-existing files

Gates 14 to 17 are blockers for new work. When auditing a pre-existing `DESIGN.md`, the runner reports any missing Gate 14 to 17 coverage as `major` so legacy files are flagged for repair without being hard-failed mid-stream. Raise them to blockers once the file is being actively amplified.
