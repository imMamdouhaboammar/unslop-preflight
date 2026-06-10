## v1.8.0  -  Agentic Autopilot Loop (2026-06-08)

### Added

- **`npx vdma autopilot`** — one-command agentic repair loop. The single command every user needs:
  - Runs all gates in sequence: bootstrap → validate → score → 23 gates → source scan → a11y scan
  - For every DESIGN.md failure: automatically applies targeted repairs and re-runs the gate
  - For source code issues: writes `VDMA-FIXES.md` with exact fix instructions for the coding agent
  - Multi-pass loop (`--max-passes=3` default) — keeps repairing until all gates pass or max passes reached
  - Colored terminal UI with per-phase status and repair detail lines
  - Options: `--max-passes`, `--no-source-scan`, `--no-impeccable`, `--dry-run`
  - Exit codes: 0 = all passed, 1 = DESIGN.md issues remain, 2 = source fixes needed

- **`scripts/autopilot.mjs`** — the orchestrator engine:
  - Phase-based execution (Bootstrap → Validate → Score → Gates → UI Scan → A11y Scan → Intake/Standards)
  - Auto-detects `DESIGN.md`, `PRODUCT.md`, `src/` from the working directory
  - Parses gate failure output to inject targeted DESIGN.md repairs per failure type
  - Writes `VDMA-FIXES.md` for source issues that require an agent or human to fix

- **`scripts/repair-design-md.mjs`** — targeted DESIGN.md + PRODUCT.md auto-repair engine:
  - Detects and patches all 6 required sections (Overview, Colors, Typography, Elevation, Components, Do's and Don'ts)
  - Detects and injects all required fields: Impeccable setup gate, Creative North Star, color token table, viewport contract, modal contract, z-index token scale, popup strategy (Gate 23), typography scale, overlay system declaration
  - Creates PRODUCT.md from template if missing
  - Outputs machine-readable JSON repair log for the autopilot to parse
  - Can be used standalone: `npx vdma repair`

- **`npx vdma repair`** — new CLI command calling `repair-design-md.mjs` directly

- **`VDMA-FIXES.md`** — auto-generated fix file for source code issues:
  - Lists every blocker found in UI scanner + accessibility scanner
  - Includes an agent prompt for applying all fixes: "Apply all fixes listed in VDMA-FIXES.md, then run: npx vdma autopilot"
  - Re-running autopilot after fixes verifies and closes the loop

### Updated

- `bin/cli.mjs`: `autopilot` and `repair` commands added; `autopilot` is now the recommended first command shown in help
- `package.json`: version → 1.8.0; `autopilot` and `repair` npm scripts added
- `CONTRIBUTING.md`: Updated with autopilot architecture notes

### Agent loop pattern (how it works end-to-end)

```
User: npx vdma autopilot
  → Bootstrap: creates DESIGN.md + PRODUCT.md if missing
  → Repair: patches missing sections and required fields
  → Validate: re-validates after repair
  → Score: improves if below threshold
  → 23 gates: repairs DESIGN.md for each failure, re-runs
  → Source scan: writes VDMA-FIXES.md for source blockers
  → A11y scan: appends to VDMA-FIXES.md

User: "Claude, apply all fixes in VDMA-FIXES.md"
  → Claude applies source fixes

User: npx vdma autopilot
  → All passes → DESIGN.md ready → implementation unblocked ✓
```

## v1.7.0  -  Viral Launch — CLI, World-class README, Social Kit (2026-06-08)


### Changed

- **Directionality is now conditional, not Arabic-assumed.** The `SKILL.md` directionality rules now require the agent to determine the product's primary interface language from intake before applying any direction rules. LTR is the default. RTL rules apply only when the product explicitly requires Arabic, Hebrew, or another RTL language. English-only and LTR products must not receive unused RTL rules. This change affects: `Directionality and alignment` rule, `Typography` section, `Required design decisions`, `Intake Session Gate`, and the quality gate checklist.

### Added

- **Gate 23: Popup and Floating Element Positioning Gate.** This gate addresses the common failure pattern where AI-generated dropdowns, popovers, tooltips, date pickers, and comboboxes overflow the viewport because the agent hardcodes a single direction without checking available space.

  Key requirements:
  - Every product with floating elements must declare a positioning strategy (A, B, or C) in `DESIGN.md`. Missing strategy declaration is a blocker.
  - **Strategy A:** CSS Anchor Positioning with `position-try-fallbacks` for native 2025+ browser support.
  - **Strategy B:** Floating UI / Popper.js with mandatory `flip()`, `shift({ padding: 8 })`, and `size()` middleware. Disabling `flip()` is a Gate 23 failure.
  - **Strategy C:** CSS `max-block-size: 40vh` clamp for simple dropdowns where the trigger is always in the top half of the page.
  - **Portal mounting rule:** floating elements that need to escape their parent container must use `createPortal` (React), `Teleport` (Vue), or `document.body` append. Building a floating element inside an `overflow: hidden` parent without portal mounting is a blocker.
  - **Z-index token scale:** standardized at `--z-sticky: 100; --z-dropdown: 200; --z-tooltip: 300; --z-modal: 400; --z-toast: 500`. Magic numbers are forbidden.

- **Modal centering hardened (Gate 19 reinforcement).** The recommended modal CSS pattern now explicitly bans `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)` without `max-block-size` clamp. The required pattern uses `position: fixed; inset: 0; display: grid; place-items: center; overflow-y: auto` on the backdrop with `align-self: safe center` on the modal card. Explanation added: at 568px viewport height, a 600px modal card overflows 16px above the screen with the transform pattern.

- `references/ai-failure-patterns.md`: Section G added  -  Popup and floating element positioning failures (G1–G5):
  - G1: Hardcoded single-direction popup.
  - G2: Popup clipped by overflow parent.
  - G3: Modal card rendered outside viewport on small screens.
  - G4: Z-index too low for popup or tooltip.
  - G5: Fixed-height popup without internal scroll.

- `references/overlay-system-rules.md`: Popup and Floating Element Positioning section added  -  covering Strategy A/B/C, portal mounting rule, z-index token scale, forbidden patterns, and Gate 23 QA checklist.

- `SKILL.md`:
  - Gate 23 section added with three positioning strategies, overflow parent trap explanation, z-index token scale, required DESIGN.md entry per floating element, and QA checklist.
  - Gate 23 added to hard-blocking gates list.
  - Popup positioning strategy added to required design decisions.
  - Scanner rules updated: two new blockers (`popup-overflow-parent`, `transform-modal-no-clamp`) and two new warnings (`dropdown-no-flip`, `tooltip-no-zindex-token`).
  - Quality gate checklist expanded with three Gate 23 checks.

### Design philosophy
- Gate 23 follows the same principle as Gate 21: remove the ability to build the wrong thing, not just warn about it. By requiring a declared positioning strategy in `DESIGN.md` before implementation, the agent cannot choose a direction arbitrarily.
- The directionality change reflects a recurring problem: skills written for Arabic-first work were being applied to English-only products, adding unused RTL rules that confused agents and produced incorrect LTR layouts. The fix is declarative: ask at intake, decide once, enforce throughout.

### Technical references
- Floating UI: https://floating-ui.com/docs/middleware
- CSS Anchor Positioning: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
- WCAG 2.2 Focus Not Obscured (2.4.11)


## v1.6  -  Dashboard Shell, Overlay Stack, and Sensitive Data Gates (2026-06-03)

### Added

- Gate 20: Dashboard shell and layout governance gate. Requires declared grid layout with sidebar and main content, explicit scroll ownership per region, auth action hierarchy with one dominant CTA, form field quality gate with visible labels, and data table overflow handling.
- Gate 21: Overlay stack and collision governance gate. Bans all ad-hoc overlay construction. All overlays must come from a centralized system. Toast construction ban: no manual toast in page components, use Toast System API only. Toast safe placement algorithm reads layout safe areas. Feedback pattern selection: toast for low-risk only, inline for forms, banner for warnings, modal for sensitive actions. Toast contrast rules (solid, 4.5:1 minimum). Toast queue rules (1 mobile, 2 desktop, 5s minimum, pause on hover). Guided tour collision handling. z-index token scale.
- Gate 22: Sensitive data display governance gate. Tokens masked by default (prefix + last 4). Copy with feedback. Temporary reveal. Secure creation flow via modal (shown once, not toast). Destructive actions require confirmation. LTR token prefix isolation in Arabic.
- `references/overlay-system-rules.md`: comprehensive overlay system reference (180+ lines) covering No Ad-hoc Overlay Rule, Overlay Stack Contract, Toast Construction Ban, Toast Safe Placement Algorithm, Layout Safe Area Registry, Feedback Pattern Selection, Toast Contrast Rules, Toast Queue Rules, Toast Collision Rules, Guided Tour Panel Rules, and Overlay Collision Testing with Playwright concept.
- `references/dashboard-shell-rules.md`: comprehensive dashboard reference (150+ lines) covering Extended Page Type Contract, Auth Action Hierarchy, Dashboard Shell Contract, Dashboard Scroll Ownership table, Data Table Layout Rules, Form Field Quality Gate, and Visual Hierarchy Rules.
- `references/sensitive-data-rules.md`: comprehensive sensitive data reference (100+ lines) covering Default Masking Rule, Copy and Reveal Behavior, Secure Creation Flow, Destructive Actions, Table Display Rules, and RTL Considerations.
- `SKILL.md`: concise Gate 20/21/22 sections with key requirements and pointers to reference files. Overlay stack, dashboard shell, and sensitive data subsections added to Non-negotiable UI rules. Required design decisions expanded. Quality gate mental check expanded.
- `scripts/scan-ui-implementation.mjs`: 6 new rules:
  - O1 (blocker): manual `position: fixed` toast in page component.
  - O2 (warning): hardcoded bottom-left/right toast placement.
  - O3 (warning): transparent toast surface.
  - O4 (warning): direct z-index in toast/overlay code.
  - S1 (blocker): exposed secret token pattern (`sk_live_`, `pk_test_`, etc.) in source.
- `assets/DESIGN.template.md`: Auth Action Hierarchy table, Dashboard Shell Contract table, Overlay Stack Contract table with z-index tokens, Sensitive Data Display Rules table. Non-negotiable rules expanded. 6 new anti-patterns in Don'ts.
- `assets/qa-checklist.md`: Dashboard Shell QA (8 items), Overlay Stack QA (11 items), Sensitive Data QA (8 items).
- `assets/implementation-prompt.template.md`: overlay system, dashboard shell, and sensitive data instructions added. Anti-patterns list expanded.
- `references/non-negotiable-ui-rules.md`: sections 9 (Dashboard shell and layout governance), 10 (Overlay stack and collision governance), 11 (Sensitive data display governance).

### Design philosophy
- Gate 21 follows a different approach from previous gates: instead of telling the AI "place the toast correctly," it removes the AI's ability to build toast at all. The principle: make the wrong behavior impossible, not just discouraged. Manual toast construction is a blocker, not a warning.
- Gate 22 treats sensitive data display as a security UX concern, not a styling preference. Full tokens in tables are treated as a blocker-level scanner finding.

### Technical references
- Radix UI Toast: centralized ToastProvider and ToastViewport pattern
- React Aria Toast: queue-based toast region with ARIA landmark and auto-dismiss (5s minimum)
- Material Design Snackbar: placement avoidance guidelines
- WCAG 2.2: Contrast Minimum (1.4.3), Non-text Contrast (1.4.11), Target Size Minimum (2.5.8), Focus Appearance (2.4.13), Labels or Instructions (3.3.2)
- MDN: CSS overflow, viewport height media queries
- DEV Community: why 100vw causes horizontal scrollbar
- W3C WAI-ARIA: Dialog (Modal) Pattern

## v1.5  -  Modal, Dialog and Overlay Governance Gate (2026-06-03)

### Added
- Gate 19: Modal, dialog and overlay governance gate. Every modal must declare a contract covering type, scroll owner, background behavior, focus behavior, viewport behavior, and RTL handling before implementation.
- `SKILL.md`: full Modal, Dialog and Overlay Governance Gate section with Modal Contract, Required Modal Behavior, Modal Scroll Lock (distinct from auth viewport rules), Modal Viewport Sizing, Backdrop Rules (with tokenized values), Form Modal Rules, Target Size Rules (44x44 preferred, 24x24 minimum per WCAG 2.2 AA), Contrast Rules, RTL and Mixed-Language Rules (BiDi isolation with `<bdi>`), Modal Copy Rules, recommended CSS pattern, and Modal QA Gate.
- `SKILL.md`: "Modal and overlay governance" subsection added to Non-negotiable UI rules.
- `SKILL.md`: modal contract added to required design decisions.
- `scripts/scan-ui-implementation.mjs`: 5 new modal rules:
  - M1 (warning): dialog/modal without accessible name (`aria-labelledby` or `aria-label`).
  - M2 (warning): input with placeholder but potentially missing visible label.
  - M3 (warning): close button with insufficient target size.
  - M4 (warning): fixed modal/dialog width without responsive max.
  - M5 (warning): modal/dialog without focus trap indicator (heuristic multi-line check).
- `assets/DESIGN.template.md`: "Modal or drawer" component template expanded from 12 fields to 40+ fields covering modal contract, scroll lock, focus behavior, backdrop, sizing, close button, RTL/BiDi, copy rules, and anti-patterns.
- `assets/DESIGN.template.md`: "In-app popup system" expanded to reference modal governance, scroll lock, and backdrop salience.
- `assets/DESIGN.template.md`: modal anti-patterns added to Don'ts section.
- `assets/qa-checklist.md`: Modal QA section with 22 checkpoint items.
- `assets/implementation-prompt.template.md`: modal contract check and modal anti-patterns added.
- `references/non-negotiable-ui-rules.md`: section 8 (Modal, dialog, and overlay governance) with required and forbidden patterns.

### Strengthened
- `SKILL.md` quality gate mental check now includes modal contract verification.
- `SKILL.md` scanner description updated to include modal rules.

### Technical references
- W3C WAI-ARIA: Dialog (Modal) Pattern for focus trapping and inert background
- MDN: CSS overflow for understanding modal scroll ownership
- W3C WCAG 2.2: Labels or Instructions (3.3.2) for form modal labels
- W3C WCAG 2.2: Contrast Minimum (1.4.3) for modal text contrast
- W3C WCAG 2.2: Target Size Minimum (2.5.8) for close button hit area
- W3C WCAG 2.2: Focus Appearance (2.4.13) for focus states inside modals

### Notes
- Backward compatible: existing well-formed `DESIGN.md`/`PRODUCT.md` continue to pass. The modal governance gate adds new requirements for newly generated files.
- Modal scroll lock is intentionally different from the viewport governance auth rules. Auth pages must never use blanket overflow:hidden. Modal scroll lock is a controlled, temporary lock that preserves position, prevents layout shift, and restores cleanly.

## v1.4  -  Viewport Governance Gate (2026-06-03)

### Added
- Gate 18: Viewport governance gate. Every page route must declare a Page Viewport Contract (`single-screen-fit`, `document-scroll`, `panel-scroll`, `data-overflow-exception`) before the agent writes CSS.
- `SKILL.md`: full Viewport Governance Gate section with Page Viewport Contract, False No-Scroll Fix Ban, Viewport Units Rule (dvh/svh), Auth Page Layout Recipe (centered/bounded/viewport-aware shell CSS), Height-Aware Responsiveness, Viewport Test Matrix, and Automated Viewport Scan.
- `SKILL.md`: Viewport ownership and scroll governance added to the Non-negotiable UI rules section.
- `scripts/scan-viewport-fit.mjs`: Playwright-based automated viewport fit scanner. Tests single-screen-fit routes at 8 viewport sizes (320x568 through 1440x900) for horizontal overflow and unnecessary vertical scroll. Configurable routes via `--routes` flag.
- `scripts/scan-ui-implementation.mjs`: 7 new viewport/scroll rules:
  - V1 (warning): `100vw` / `w-screen` horizontal overflow risk.
  - V2 (warning): blind `100vh` / `h-screen` full-page height.
  - V3 (warning): fixed auth card width without responsive max.
  - V4 (warning): Tailwind `h-screen` without dvh/min-h fallback.
  - V5 (warning): Tailwind `w-screen` with padding risk.
  - V6 (blocker): blanket `overflow:hidden` on root/page shell selectors in CSS.
  - V7 (blocker): Tailwind root `overflow-hidden` freeze on `h-screen`/`min-h-screen` wrappers.
- `assets/DESIGN.template.md`: Page Viewport Contract table added under Layout model. Viewport ownership rules added to Non-negotiable interface rules. Viewport anti-patterns added to Don'ts.
- `assets/qa-checklist.md`: Viewport QA section with 11 checkpoint items.
- `assets/implementation-prompt.template.md`: viewport contract check, dvh fallback rule, overflow:hidden ban, and `scan-viewport-fit.mjs` added to pre-final-output steps.
- `references/non-negotiable-ui-rules.md`: section 6b (Viewport ownership and scroll governance) with required and forbidden patterns.

### Strengthened
- `SKILL.md` scanner description updated to include viewport blocker and warning rules.
- `SKILL.md` quality gate mental check now includes viewport ownership verification.
- `SKILL.md` required design decisions list now includes Page Viewport Contract with scroll ownership per route.

### Technical references
- MDN: `overflow` CSS property (developer.mozilla.org)
- MDN: viewport units `svh`, `lvh`, `dvh` (developer.mozilla.org)
- web.dev: large, small, and dynamic viewport units
- MDN: `height` CSS media feature
- Playwright: viewport configuration per browser context (playwright.dev)
- Playwright: device emulation (playwright.dev)
- MDN: `box-sizing: border-box` behavior

### Notes
- Backward compatible: existing well-formed `DESIGN.md`/`PRODUCT.md` continue to pass. The viewport governance gate adds new requirements for newly generated files.
- The Playwright scanner (`scan-viewport-fit.mjs`) requires `npx playwright install chromium` and a running dev server. If Playwright is unavailable, the gate falls back to manual testing at the documented viewport matrix.

## v1.3  -  Recommended companion: Vibe Driven Dev (2026-05-31)

### Added
- Recommends installing Vibe Driven Dev (`vibe-driven-dev`, OpenOps Studio) alongside Impeccable as the pre-execution layer (PRD, scope, stack, architecture, audit, handoff to Spec Kit).
- `references/impeccable-workflow.md`: full VDD companion section (install, commands, ordering, pairing with the accessibility scanner and intake gate).
- `SKILL.md`: VDD companion section after the Impeccable workflow, plus a pointer in the Impeccable install gate.
- `README.md`: "Recommended companion: Vibe Driven Dev" section with install commands and tool division.
- `scripts/impeccable-preflight.sh`: detects `vdd`, surfaces VDD artifacts (PRD/Scope/Stack) for reuse, and advises install when missing. Advisory only, never blocking.
- `assets/implementation-prompt.template.md`: optional VDD pre-step and artifact reuse note.

### Notes
- VDD is recommended, not a hard gate. Impeccable remains the mandatory design-intelligence setup. Design work is never blocked if VDD is absent.


## v1.2  -  Deep accessibility scanner (2026-05-31)

### Added
- `scripts/scan-accessibility.mjs`: a static ARIA / landmark / semantics audit, separate from the general UI scanner and deeper on accessibility. Each finding maps to a WCAG 2.2 criterion with file and line. Covers: multiple/missing `<main>`, non-semantic landmark divs, heading-order jumps and multiple `<h1>`, `<img>` without `alt`, `aria-hidden` on interactive elements, positive tabindex, invalid/redundant roles, icon-only controls with no accessible name, form fields with no label association, clickable non-interactive elements missing role/tabindex/key handler, `aria-labelledby`/`describedby` pointing at missing ids, duplicate ids, missing `lang`/`dir` on `<html>`, and empty links/buttons. Supports `--strict`.
- `run-gates.mjs` now invokes the accessibility scanner when a source directory exists.
- `SKILL.md` documents the scanner and adds gates 14-17 to the hard-blocking list.

## v1.1  -  Evidence-based AI failure hardening (2026-05-31)

Added research-backed anti-patterns and stronger enforcement, based on 2026 accessibility audits and practitioner field reports on how AI coding agents fail at UI.

### Added
- `references/ai-failure-patterns.md`: 24 evidence-based failure patterns across six groups (semantic/structural, visual convergence, state/content, responsive, token/drift, interaction/feedback). Each has symptom, root cause, corrective rule, and the gate or scanner rule that enforces it.
- Rules engine gates 14 to 17:
  - Gate 14: semantic HTML and interaction integrity (no clickable divs, keyboard operability, landmarks, labeled icons).
  - Gate 15: realistic content (no lorem ipsum, John Doe, example emails, fake metrics).
  - Gate 16: design tokens, not hardcoded values.
  - Gate 17: drift control (single source of truth, no invented tokens, re-run gates per merge, no destructive auto-fixes).

### Strengthened
- `scripts/scan-ui-implementation.mjs` rewritten with severity levels (blocker vs warning) and new rules:
  - Blockers: clickable `<div>`/`<span>` onClick, lorem ipsum, John/Jane Doe, example.com emails, native popups.
  - Warnings: generic gradients (now incl. indigo), default Inter font, hardcoded hex colors, blanket `overflow:hidden`, emoji and sparkle icons, focus-outline removal, onClick without keyboard handler, Item 1/2/3 filler.
- `scripts/run-gates.mjs`: added design-level checks for gates 14 to 17, reported as `major` warnings so pre-existing files are flagged without a hard mid-stream fail.
- `SKILL.md`: expanded the Anti-AI UI rules with structural and functional failures; updated the scanner description and the amplify audit list to include the new reference.
- `references/source-notes.md`: added the 2026 evidence base with sourcing and the WCAG/MDN cross-check note.

### Notes
- Backward compatible: existing well-formed `DESIGN.md`/`PRODUCT.md` continue to pass.
- The new evidence is directional. Binding rules still come from WCAG 2.2, MDN, and each project's `STANDARDS.search-notes.md`.
