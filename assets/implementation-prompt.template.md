# Implementation Prompt Template

Use this prompt with a coding agent after `PRODUCT.md` and `DESIGN.md` exist.

```text
You are implementing UI for this project.

Before writing code:
1. Run the intake gate and make sure `INTAKE.session.md` exists. If Vibe Driven Dev (VDD) artifacts exist (PRD, Scope, Stack-Decision, Architecture), reuse them as intake inputs instead of re-asking.
2. Run the 2026 standards gate and make sure `STANDARDS.search-notes.md` exists or is marked as bundled-references-only.
3. Run `npx impeccable skills install` from the project root if it has not already been run. If it fails, document why. When the idea, scope, or stack is still unclear, it is recommended to run VDD first (`npx vibe-driven-dev install claude-code --project`, then `vdd run /vibe.start`); VDD is recommended, not required.
4. Read PRODUCT.md.
5. Read DESIGN.md.
6. Run `node scripts/run-gates.mjs DESIGN.md PRODUCT.md src` and repair blockers before implementation.
7. Check the Page Viewport Contract in DESIGN.md. Every route must be classified as single-screen-fit, document-scroll, panel-scroll, or data-overflow-exception before writing CSS.
8. Do not choose colors, typography, spacing, shadows, radii, motion, icon style, or component patterns freely.
9. Every visual decision must trace back to DESIGN.md.
10. If a required rule is missing, update DESIGN.md first and state the addition.
11. Avoid all anti-AI UI patterns listed in DESIGN.md and references/anti-ai-ui-slop.md.
12. Do not use `h-screen` or `height: 100vh` blindly. Prefer `min-height` / `min-block-size` with `100dvh` fallback strategy. If the page is auth, it should visually fit the viewport at normal sizes, but still allow safe vertical scrolling if keyboard, zoom, localization, or error states increase content height.
13. Do not apply blanket `overflow: hidden` to `html`, `body`, `#root`, `main`, or page shells. Fix the actual cause of overflow instead.
14. Every modal must be a complete interaction system: focus trapping, scroll lock, inert background, backdrop salience, viewport-safe sizing, accessible naming, and focus restoration. A centered card is not a valid modal. Check the modal contract in DESIGN.md before implementing any dialog.
15. All overlays (toast, tour, popover, dropdown) must come from the centralized Overlay System. Do not build ad-hoc `position: fixed` overlays in page components. Do not create manual toast markup. Use the Toast System API only.
16. Dashboard pages must use the declared shell grid layout from DESIGN.md. Main content must not slide under the sidebar. Scroll ownership per region must match the dashboard shell contract.
17. Sensitive tokens and API keys must be masked by default. Secret creation must use a secure result modal, not a toast. Delete and revoke require confirmation.
18. If Impeccable is available, run or follow:
   - /impeccable shape
   - /impeccable craft
   - /impeccable critique
   - /impeccable polish
19. Before final output, run:
   - node scripts/validate-design-md.mjs DESIGN.md
   - node scripts/score-design-md.mjs DESIGN.md PRODUCT.md
   - node scripts/run-gates.mjs DESIGN.md PRODUCT.md src
   - node scripts/scan-ui-implementation.mjs src
   - node scripts/scan-viewport-fit.mjs http://localhost:3000 (when Playwright is available)
   - npx impeccable detect src/ if Impeccable is installed

Task:
[Write the implementation task here]
```


## Mandatory non-negotiable UI rules

Before writing UI code, confirm that `DESIGN.md` includes the exact command `npx impeccable skills install`, plus rules for contrast, AI color control, icon system, directionality, UX-CRX logic, responsive mobile behavior, modern web baseline, and in-app popup patterns.

Do not use:

- Low contrast color pairs.
- Generic purple, blue, teal, pink, neon, or aurora gradients as product identity.
- Sparkle icons, magic icons, robot icons, or emojis as UI icons.
- RTL text inside an LTR shell, or LTR text inside an RTL shell without a documented content reason.
- Unjustified stacking of panels, cards, CTAs, and filters.
- Desktop-only layouts pretending to be responsive.
- Native browser `alert()`, `confirm()`, or `prompt()` for product UX.
- Blanket `overflow: hidden` on `html`, `body`, `#root`, `main`, or page shells to mask scroll.
- `width: 100vw` on padded wrappers.
- Fixed `height: 100vh` on content-heavy containers without a documented internal scroll owner.
- `h-screen` without `dvh` or `min-h` fallback.
- A centered card as a modal without focus trapping, scroll lock, inert background, and accessible naming.
- Background scroll or interaction while a modal/dialog/drawer is open.
- Placeholder as the only label inside form modals.
- Close buttons smaller than 24x24px without accessible labels.
- Ad-hoc `position: fixed` overlays (toast, popover, tour) inside page components.
- Manual toast construction. Use the centralized Toast System only.
- Transparent or glass toast backgrounds over busy pages.
- Toast as the only feedback for sensitive actions (API key creation, destructive actions).
- Full API keys, tokens, or secrets visible in tables without masking.
- Dashboard main content sliding under the sidebar.
- Tables causing page-level horizontal scroll.

Use a designed in-app system for modals, drawers, toasts, banners, inline validation, and confirmations.
