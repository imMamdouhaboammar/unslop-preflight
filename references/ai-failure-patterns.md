# AI UI Failure Patterns (Evidence-Based, 2026 Field Reports)

## Purpose
This file lists the specific UI failures that AI coding agents produce most often, drawn from practitioner reports, accessibility audits, and community complaints through early 2026. Each entry has: the symptom, the root cause, the rule that prevents it, and where the design system enforces it. Read this before writing `DESIGN.md`, before implementation, and during review. It complements `anti-ai-ui-slop.md` (surface look) by focusing on structural, functional, and behavioral failures.

How to use it: every pattern below maps to a gate in `rules-engine.md` or a scanner rule in `scripts/scan-ui-implementation.mjs`. When a project hits one, repair the artifact, do not document an exception unless the product context truly demands it.

---

## A. Structural and semantic failures (the most damaging, least visible)

### A1. Clickable divs instead of buttons and links
- **Symptom:** interactive elements built as `<div onClick>` or `<span onClick>` with no role, not focusable, no keyboard support. Audits in early 2026 found this in the large majority of AI-generated interactive components.
- **Root cause:** the model reproduces visual output without the interaction contract; a styled div looks identical in a screenshot.
- **Rule:** every action is a `<button>`; every navigation is an `<a href>`. No click handler on a non-interactive element. If a div must be interactive, it needs `role`, `tabindex="0"`, and key handlers, and that is a last resort, not a default.
- **Enforced in:** rules-engine Gate 14; scanner rule `clickable-div`.

### A2. No keyboard operability
- **Symptom:** custom controls handle `onClick` but not Enter/Space; focus order is broken; nothing works without a mouse.
- **Root cause:** training data shows mouse-first examples; keyboard paths are invisible in static output.
- **Rule:** every interactive control is reachable and operable by keyboard, with logical focus order. Native elements first; custom controls carry explicit key handling.
- **Enforced in:** Gate 14; scanner rule `onclick-without-key`.

### A3. Missing landmarks and heading structure
- **Symptom:** flat `<div>` soup with no `header`, `nav`, `main`, `footer`, or heading hierarchy. Screen readers hear unstructured text.
- **Root cause:** visual layout does not require semantics to look right.
- **Rule:** one `<main>`, real landmarks, a single `<h1>` per view, ordered headings. Components declare their landmark role in their contract.
- **Enforced in:** Gate 14.

### A4. Unlabeled icons and icon-only controls
- **Symptom:** icon buttons with no accessible name; decorative SVGs with neither `aria-hidden` nor a label.
- **Root cause:** the icon is visually obvious to a sighted reviewer, so the model omits the name.
- **Rule:** functional icons carry an accessible name; decorative icons are `aria-hidden`. Icon-only buttons require `aria-label`.
- **Enforced in:** Gate 14; component contract.

---

## B. Visual convergence failures (everything looks the same)

### B1. Distributional convergence
- **Symptom:** every output gravitates to the same median look: centered hero, "Welcome to Our Product" at large size, three-column feature grid, one gradient CTA. Reported across GPT, Claude, and Gemini outputs.
- **Root cause:** language models pull toward the statistical center of their training data unless pushed away by explicit design intent. Anthropic names this "distributional convergence".
- **Rule:** the `DESIGN.md` Overview must state a creative north star, a visual thesis, and a density level specific to this product. The first screen must say something only this product can say.
- **Enforced in:** Gate 7; quality-rubric "Visual point of view".

### B2. The indigo/purple-blue gradient default
- **Symptom:** purple or blue gradient on buttons, cards, and backgrounds even when nobody asked.
- **Root cause:** a popular CSS framework shipped indigo-500 as its default accent years ago; tutorials and examples repeated it, then it was scraped into training data. The model now treats indigo as "what a button is".
- **Rule:** the palette is chosen for the product in `DESIGN.md` with named roles and hex values. No gradient as identity unless the brand justifies it. Default framework accents are never the brand.
- **Enforced in:** Gate 7; scanner rule `generic-gradient`.

### B3. One default body font everywhere
- **Symptom:** the same geometric sans (commonly Inter) on every project regardless of brand.
- **Root cause:** same convergence pressure as color.
- **Rule:** `DESIGN.md` Typography names a deliberate font pairing tied to the brand and audience. The choice is justified, not defaulted.
- **Enforced in:** quality-rubric "Visual point of view".

### B4. Mathematically even, emotionally flat spacing
- **Symptom:** the same 16px or 24px gap everywhere; perfectly symmetric, centered layouts with no hierarchy or rhythm.
- **Root cause:** uniform spacing is the safe statistical choice and never looks broken in isolation.
- **Rule:** define a spacing rhythm that varies by relationship (tight inside controls, comfortable inside cards, architectural between sections). Layout expresses hierarchy, not symmetry for its own sake.
- **Enforced in:** Gate 7; design-md spacing rhythm requirement.

---

## C. State and content failures (breaks in production, not in the demo)

### C1. Missing invisible states
- **Symptom:** only the happy, full-data screen exists. No loading, empty, error, success, hover, focus, disabled, or partial states.
- **Root cause:** the model renders one static screen; the other states never appear in a single training example.
- **Rule:** every async surface and every component defines loading, empty, error, and success states. Skeletons for known layouts, honest progress for long work, recovery copy for errors.
- **Enforced in:** Gate 5, Gate 11; component contract "States".

### C2. Fake and placeholder data that hides layout truth
- **Symptom:** "Lorem ipsum", "John Doe", "user@example.com", "Item 1 / Item 2 / Item 3", placeholder avatars and fake metrics.
- **Root cause:** the model fills slots with the most common filler; it does not reason about how real content stresses the layout.
- **Rule:** use realistic example content that reflects true value ranges. Real names of varying length, real numbers of varying magnitude (a price of 4.99 occupies different space than 12,847.32), real labels. Content shape is a design input, not an afterthought.
- **Enforced in:** Gate 15; scanner rule `placeholder-data`.

### C3. Disappearing helper and placeholder text
- **Symptom:** the only label is a placeholder that vanishes on input; instructions disappear before the user can act.
- **Root cause:** placeholder-as-label is a compact pattern common in examples.
- **Rule:** every field has a persistent `<label>`. Placeholders hint, they never replace labels. Helper and error text persist while needed.
- **Enforced in:** Gate 11; component contract Inputs.

---

## D. Responsive and layout failures

### D1. Desktop stacked, not redesigned
- **Symptom:** mobile is the desktop layout collapsed into one column with no rethink of navigation, density, or priority.
- **Root cause:** stacking is the cheapest transformation and still renders.
- **Rule:** mobile has its own hierarchy, navigation pattern, and interaction rhythm. Grids re-flow to a defined column count per breakpoint, not a blind stack.
- **Enforced in:** Gate 9.

### D2. Overflow and viewport breakage
- **Symptom:** content wider than the viewport, horizontal scroll, fixed grids that do not fit small screens, `overflow: hidden` that traps necessary scrolling, containers rendered outside the viewport.
- **Root cause:** fixed widths and unconstrained children look fine at the one width the model imagined.
- **Rule:** fluid widths and reserved boxes; test at 320 / 360 / 390 / 414 / 768 / 1024 / 1280 / 1440. No horizontal scroll outside an intentional, signposted data table. Use `overflow-x` and `overflow-y` deliberately, never a blanket `overflow: hidden` on layout containers.
- **Enforced in:** Gate 9; scanner rule `layout-overflow-hidden` (warning).

### D3. Sticky elements covering the focused control
- **Symptom:** a sticky header, bottom bar, or generation overlay hides the field or action the user is on, especially with a mobile keyboard open.
- **Root cause:** static rendering never simulates focus, scroll, or keyboard.
- **Rule:** focus is never obscured by sticky chrome (WCAG 2.2, 2.4.11). The primary action stays reachable with the keyboard open.
- **Enforced in:** Gate 9, Gate 5.

---

## E. Token, drift, and process failures

### E1. Hardcoded values instead of tokens
- **Symptom:** raw hex colors, fixed pixel padding, and magic numbers scattered through components instead of theme tokens.
- **Root cause:** inline literals are the simplest thing that renders; tokens require a system the model was not told about.
- **Rule:** colors, spacing, radii, and typography come from the `DESIGN.md` token set. No undocumented hex or token in implementation.
- **Enforced in:** Gate 12; scanner rule `hardcoded-hex` (warning), `inter-hardcoded` (warning).

### E2. Spec drift within a single generation
- **Symptom:** the model honors some instructions and silently drops others (a 240px rail becomes 280px, a named chart library becomes a different one, an unrequested nav item appears).
- **Root cause:** long, dense instructions exceed reliable adherence; the model satisfices.
- **Rule:** put the binding decisions in a compact token table and component list, not buried prose. The implementation prompt points to `DESIGN.md` as the single source of truth and forbids inventing tokens.
- **Enforced in:** Gate 17; implementation prompt template.

### E3. Context drift across a long session (vibe-coding)
- **Symptom:** standards set early in a session erode; the agent reintroduces banned patterns, hallucinated complexity, or inconsistent components dozens of prompts later.
- **Root cause:** chat history dilutes; earlier rules fall out of effective context.
- **Rule:** the design system lives in a file the repository owns, not in chat memory. Re-point the agent at `DESIGN.md` and re-run `run-gates.mjs` before each UI merge. Treat the file as the durable contract.
- **Enforced in:** Gate 17; gates protocol re-run requirement.

### E4. Destructive auto-fixes
- **Symptom:** an agent "fixes" a warning and changes behavior or deletes data, with no clear explanation of what changed.
- **Root cause:** the agent optimizes for making the warning disappear, not for preserving intent.
- **Rule:** destructive or schema-level changes need an explicit confirmation surface and a stated diff. Never auto-apply a fix that alters data or behavior without surfacing it.
- **Enforced in:** Gate 10 (feedback/confirmation), Gate 17.

---

## F. Interaction and feedback failures

### F1. No micro-interaction or feedback on action
- **Symptom:** buttons with no hover, focus, active, or loading feedback; actions that give no sign they registered.
- **Rule:** interactive elements define hover, focus-visible, active, disabled, and loading. Feedback is immediate and visible.
- **Enforced in:** Gate 11; component contract.

### F2. Native browser popups for product flows
- **Symptom:** `alert()`, `confirm()`, `prompt()` used for confirmation, deletion, errors, or onboarding.
- **Rule:** in-app feedback only: toasts, inline validation, and `<dialog>`-based modals/drawers. Native popups are never a product surface.
- **Enforced in:** Gate 10; scanner rules `alert`/`confirm`/`prompt`.

### F3. Hover-to-reveal critical information; vanish-on-hover targets
- **Symptom:** essential actions or info hidden until hover; clickable elements that fade or move away on hover; nonstandard navigation that defies expectation.
- **Root cause:** novelty patterns copied without considering touch, keyboard, or discoverability.
- **Rule:** critical info and actions are visible without hover and work on touch and keyboard. Hover enhances, it is never the only path. Navigation follows conventional, discoverable patterns.
- **Enforced in:** Gate 8, Gate 9.

### F4. Color as the only signal
- **Symptom:** state, selection, or severity shown by hue alone (success green, error red, selected tile by color).
- **Rule:** pair color with text, icon, or shape. Selection shows a border plus a check plus a label, never color alone.
- **Enforced in:** Gate 5; component contract.

---

## Review pass (run mentally before handoff)
- Is every action a real button or link, operable by keyboard, with a visible focus state?
- Do landmarks and headings give the page a real structure?
- Could this screen belong to fifty other startups, or does it have a stated point of view?
- Is the palette and type chosen for this product, or defaulted from framework and training bias?
- Do loading, empty, error, and success states exist for every async surface?
- Is the content realistic enough that the layout would survive real data?
- Does mobile have its own rhythm, with no overflow and no obscured focus?
- Do colors, spacing, and radii come from documented tokens?
- Is the durable contract in the file, not in the chat session?

---

## G. Popup and floating element positioning failures

### G1. Hardcoded single-direction popup
- **Symptom:** dropdown, tooltip, date picker, or combobox always opens in one direction (almost always below the trigger), even when the trigger is near the bottom of the viewport. The popup extends off-screen, becomes invisible, or forces the page to grow.
- **Root cause:** the model outputs `position: absolute; top: 100%; left: 0` because that is the most common pattern in training examples. It never checks available space.
- **Rule:** every floating element must declare a flip strategy. For JavaScript stacks, `flip()` middleware is mandatory (Floating UI, Popper.js). For CSS-only, use Strategy C only when the trigger is always in the top half. CSS Anchor Positioning with `position-try-fallbacks` is the native 2025+ approach.
- **Enforced in:** Gate 23; DESIGN.md popup positioning strategy field.

### G2. Popup clipped by overflow parent
- **Symptom:** a dropdown or tooltip is cut off at the boundary of its parent card or panel, which has `overflow: hidden`. The popup appears partial or disappears entirely at the edge of the card.
- **Root cause:** the agent places the floating element inside the triggering container. The container's `overflow: hidden` clips anything that extends beyond its bounds.
- **Rule:** all floating elements that need to visually escape their parent must be mounted outside the scroll parent using a portal pattern: `createPortal` in React, `Teleport` in Vue, or `document.body` append in plain HTML. The agent must never apply `overflow: hidden` to a container with floating-element children without verifying no popup escapes it.
- **Enforced in:** Gate 23; scanner rule `popup-overflow-parent`.

### G3. Modal card rendered outside viewport on small screens
- **Symptom:** on short viewports (568–640px height), the top portion of a modal card is hidden above the visible area and cannot be scrolled to. This happens with `position: fixed; top: 50%; transform: translateY(-50%)` when the card is taller than the remaining viewport space.
- **Root cause:** `transform: translate(-50%, -50%)` centered on the viewport does not account for card height exceeding available space. At 568px viewport, a 600px card pushes 16px above the screen.
- **Rule:** use the backdrop grid pattern: `position: fixed; inset: 0; display: grid; place-items: center; padding: 16px; overflow-y: auto` on the backdrop, with `align-self: safe center` on the modal card. The `safe` keyword prevents the card from overflowing the top of the viewport. The `max-block-size: min(calc(100dvh - 32px), calc(100vh - 32px))` on the card ensures it never exceeds available height.
- **Enforced in:** Gate 19, Gate 23.

### G4. Z-index too low for popup or tooltip
- **Symptom:** a tooltip or popover renders visually below a sticky header, sidebar, or modal, becoming partly or fully hidden.
- **Root cause:** the agent writes `z-index: 10` or similar without checking the rest of the stack. Sticky headers commonly use `z-index: 100` or higher; the popup appears behind them.
- **Rule:** all floating elements must use z-index tokens from the shared scale. No magic numbers. The required minimum scale: `--z-sticky: 100; --z-dropdown: 200; --z-tooltip: 300; --z-modal: 400; --z-toast: 500`. Any popup below a sticky element is a Gate 23 failure.
- **Enforced in:** Gate 23; scanner rule `direct-zindex-in-overlay`.

### G5. Fixed-height popup without internal scroll
- **Symptom:** a date picker, combobox list, or long dropdown has a fixed pixel height that exceeds available viewport space. The content is cut off with no scroll affordance.
- **Root cause:** the agent hardcodes `height: 300px` without considering that the available space below the trigger may be less than 300px.
- **Rule:** popups with variable or long content must use `max-block-size` constrained to available space: Floating UI's `size()` middleware handles this automatically. CSS-only solutions must use `max-block-size: 40vh` with `overflow-y: auto` as a minimum safeguard.
- **Enforced in:** Gate 23.

---

## Review pass additions (run after G failures)
- Does every dropdown or popover have a flip strategy, or is the direction hardcoded?
- Are floating elements mounted outside overflow:hidden parents?
- Does the modal use the backdrop grid pattern with `align-self: safe center`, not the transform centering pattern?
- Do all floating elements use z-index tokens that place them above sticky headers?
- Do date pickers and comboboxes constrain their height to available viewport space?
