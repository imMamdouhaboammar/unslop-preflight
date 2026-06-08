# Non-Negotiable UI Rules Reference

## Purpose

This file defines rules that every `DESIGN.md` must include. These are not taste preferences. They are hard interface constraints for AI coding agents.

## 1. Contrast discipline

Required:

- Normal text must target at least 4.5:1 contrast against its background.
- Large text must target at least 3:1 contrast.
- Icon-only controls, input borders, focus rings, chart marks, and important non-text UI elements must remain visibly distinguishable.
- Placeholder text must never be the only source of field meaning.
- Disabled states may be visually quieter, but they must still be understandable.

Forbidden:

- Low-opacity gray text as the default secondary text style.
- Text over blurred glass, gradients, images, or glow effects without verified contrast.
- Focus outlines that are removed, hidden, clipped, or visually weaker than the component border.

## 2. AI color and gradient control

Required:

- Every palette must use semantic tokens: background, surface, text, border, accent, success, warning, error, info.
- Accent color must have a product reason and must be used to guide attention.
- Gradients must have a defined purpose and a safe fallback.
- Chart colors must remain legible in light and dark modes.

Forbidden:

- Default purple to blue gradient identity.
- Aurora gradients, neon glows, candy gradients, and decorative blurred blobs as the main identity.
- Gradient headline text unless the brand is explicitly built around it and contrast is proven.
- Random Tailwind color picking during implementation.

## 3. Icon system integrity

Required:

- Use one icon family or a deliberately documented custom set.
- Define size, stroke width, corner style, filled versus outline usage, and optical alignment.
- Functional icons need accessible labels.
- Decorative icons need `aria-hidden="true"`.

Forbidden:

- Sparkle icons, magic wands, starbursts, glitter, generic bots, and abstract AI brains as defaults.
- Emojis as UI icons in navigation, buttons, feature cards, pricing, alerts, empty states, or dashboards.
- Mixing filled icons, outline icons, 3D icons, emojis, and custom SVGs in the same product shell.

## 4. Directionality and alignment

Required:

- Arabic products must be fully RTL at the document, shell, navigation, forms, tables, modals, drawers, and component level.
- English products must be fully LTR.
- Mixed-language content must define how Arabic, English, numbers, currencies, email addresses, URLs, and code snippets behave.
- Use logical CSS properties whenever possible.
- Use `text-align: start` and `text-align: end` instead of hard-coded left and right unless the exception is intentional.

Forbidden:

- Arabic text aligned right inside an LTR shell.
- English text aligned left inside an RTL shell without a content reason.
- Mirroring non-directional icons.
- Failing to mirror arrows, chevrons, step indicators, drawers, and navigation order when the full product is RTL.

## 5. UX-CRX logic

Required:

- Every screen must define a primary action, secondary action, escape route, recovery path, and empty-state next action.
- Every section must answer: why is this here, why now, what decision does it support?
- Conversion moments must address trust, risk, cost, proof, friction, and action clarity.
- Data-heavy surfaces must support comparison, filtering, sorting, scanning, and safe decision-making.

Forbidden:

- Stacking panels because there is available space.
- Feature card grids that do not map to user decisions.
- CTAs repeated without hierarchy.
- Components that compete for the same level of attention.
- Empty states that only decorate the screen.

## 6. Responsive and mobile quality

Required:

- Design mobile as its own first-class experience.
- Define behavior for 320, 360, 390, 414, 768, 1024, 1280, and 1440px width ranges when relevant.
- Use content-based layout decisions and container-aware components where possible.
- Keep tap targets comfortable.
- Ensure forms work with mobile keyboards.
- Ensure sticky headers and bottom bars do not cover validation messages, CTAs, or focused fields.

Forbidden:

- Desktop layout merely stacked vertically on mobile.
- Horizontal scrolling outside intentional data-table patterns.
- Fixed pixel widths that break common devices.
- Hover-only interactions on touch devices.
- Important actions hidden behind desktop-only navigation.

## 6b. Viewport ownership and scroll governance

Required:

- Every page must declare a viewport mode: `single-screen-fit`, `document-scroll`, `panel-scroll`, or `data-overflow-exception`.
- `single-screen-fit` pages (auth, login, signup, OTP, password reset, onboarding success, empty states) must have no unnecessary document scroll at normal viewport sizes and zero horizontal document scroll at all tested viewports.
- Full-screen pages must use `min-block-size: 100dvh` with a `100vh` fallback instead of fixed `height: 100vh`.
- Card sizing must be fluid: `inline-size: min(100%, [max])`.
- Height-aware media queries must be used for short screens (568px, 640px, 720px).
- Safe vertical scrolling must remain available for virtual keyboard, browser zoom, error messages, and localization expansion.
- Fix layout overflow at its source: the actual problem is always a wrong width, excessive padding, absolute elements, unbounded cards, fixed height, unwrapped text, or wrong grid sizing.

Forbidden:

- Blanket `overflow: hidden` on `html`, `body`, `#root`, `main`, or page shells as a scroll fix.
- Freezing the viewport to hide scroll caused by layout mistakes.
- `width: 100vw` on padded wrappers (creates horizontal overflow).
- Fixed card widths (e.g. `width: 480px`) that exceed mobile viewport without responsive max handling.
- `height: 100vh` on content containers without a documented internal scroll owner.
- Horizontal page scrolling outside documented data-table or code-block exceptions.
- Using `h-screen` or `w-screen` Tailwind classes without a documented `dvh` or `min-h` fallback strategy.

## 7. Modern web interface baseline

Required:

- Use semantic HTML first.
- Use accessible dialogs, drawers, popovers, toasts, banners, and inline validation.
- Provide visible states for hover, active, focus, disabled, loading, success, warning, and error.
- Respect `prefers-reduced-motion`.
- Use appropriate ARIA only when native HTML is not enough.

Forbidden:

- `window.alert()`, `window.confirm()`, or `window.prompt()` for product UX.
- Blocking dialogs for low-importance feedback.
- Vague error messages.
- Hiding focus outlines.
- Using motion to distract from weak information architecture.

## 8. Modal, dialog, and overlay governance

A centered card with a dark backdrop is not a modal. Every modal must be a complete interaction system.

Required:

- Every modal must declare a modal contract before implementation: type, scroll owner, background behavior, focus behavior, viewport behavior, and RTL handling.
- The background must be inert while the modal is open. Background elements must not receive focus or clicks.
- The background must not scroll while the modal is open. Scroll position must be preserved and restored.
- Scrollbar removal must not cause layout shift. Use `scrollbar-gutter: stable` or account for the scrollbar width.
- Keyboard focus must be trapped inside the modal. Tab and Shift+Tab must not escape the dialog boundary.
- Escape must close the modal unless the action is destructive and requires explicit confirmation.
- Focus must return to the trigger element after close.
- The modal must have an accessible name via `aria-labelledby` or `aria-label`.
- The close button must have a minimum hit area of 44x44px preferred, 24x24px minimum, and an accessible label.
- Modal sizing must be viewport-aware: `max-inline-size: min(calc(100vw - 32px), [max])` and `max-block-size: calc(100dvh - 32px)`.
- When modal content overflows, the modal body scrolls internally. Header and footer remain fixed.
- Backdrop must reduce background salience. Backdrop opacity and blur must be tokenized.
- Form modals must have visible persistent labels, readable placeholders, and all interaction states.
- English tokens inside Arabic modals must be isolated with `<bdi>` or directional spans.
- Modal copy must be task-based, short, and direct.

Forbidden:

- A centered card without focus trapping, scroll lock, and accessible naming.
- Background scroll or interaction while a modal is open.
- Modal content extending outside the viewport without an internal scroll owner.
- Fixed modal widths that exceed mobile viewport.
- Fixed modal heights without internal overflow planning.
- Placeholder text as the only label inside form modals.
- Placeholder contrast that looks disabled or unreadable.
- Close buttons relying on visual icon only, without accessible label or sufficient hit area.
- Background CTAs that visually compete with the modal CTA.
- Excessive backdrop blur that makes the UI look frozen.

## 9. Dashboard shell and layout governance

Required:

- Dashboard pages must use a declared grid layout: sidebar column + main content column.
- Main content must calculate available width after sidebar. Content must never slide under the sidebar.
- Scroll ownership must be explicit per element: sidebar scrolls internally, main content scrolls internally, tables scroll horizontally inside their container, document body does not scroll.
- Auth pages must follow an action hierarchy: one dominant CTA, social login visually secondary, recovery link subtle, legal copy compact (1-2 lines, no scroll pressure).
- Every form field must have a visible persistent label. Placeholder is never a replacement for a label.
- Tables must handle overflow inside their container, not push the page wider.

Forbidden:

- Main content sliding under the sidebar.
- Tables causing page-level horizontal scroll.
- Social login buttons competing visually with the primary CTA.
- Decorative separators that look like buttons.
- Legal copy that creates unnecessary page scroll.
- More than one dominant CTA in an auth card.

## 10. Overlay stack and collision governance

The core principle: the agent must never build ad-hoc overlays inside page components.

Required:

- All overlays (toast, tour, tooltip, popover, dropdown, modal, floating assistant) must come from a centralized Overlay System.
- Toast must never be created manually inside a page. Use the centralized Toast System API only, rendered through a single ToastViewport.
- Toast placement must be collision-aware, calculated from layout safe areas.
- Toast must not be the default feedback pattern. Use toast for low-risk success only. Use inline feedback for form validation. Use banners for page warnings. Use modals for sensitive actions.
- Toast background must be solid or near-solid with 4.5:1 text contrast minimum.
- Maximum visible toasts: 1 on mobile, 2 on desktop. Queued, not stacked.
- Minimum auto-dismiss timeout: 5 seconds. Timers pause on hover, focus, page blur.
- Guided tour panels must not cover tables, forms, or CTAs. Must become bottom sheet on small screens.
- Every overlay must use z-index tokens from a shared scale.

Forbidden:

- `position: fixed` toast or overlay inside page component files.
- Hardcoded toast placement (bottom-left/right with pixel values).
- Transparent or glass toast backgrounds.
- Direct z-index values in toast or overlay code (use tokens).
- Toast covering table actions, CTAs, tour panels, or sidebars.
- Guided panel covering table content or submit buttons.
- Overlapping overlays without collision handling.

## 11. Sensitive data display governance

Required:

- All sensitive tokens (API keys, secrets, access tokens, webhook secrets) must be masked by default in persistent UI.
- Masking pattern: prefix + last 4 characters, rest replaced with bullet mask.
- Every masked token must have a copy button with visible feedback.
- Reveal is optional and must be temporary (auto-mask after 10-30 seconds).
- Generated secrets must be shown once in a secure result modal with copy button and a clear warning that the secret will not appear again.
- After closing the creation result, the secret must appear masked in all subsequent views.
- Delete, revoke, and rotate actions require explicit confirmation via destructive-action modal.
- Token prefixes are LTR; must use `<bdi>` or `dir="ltr"` in Arabic interfaces.

Forbidden:

- Full secret tokens visible in tables or cards.
- Secret creation result shown only as a toast.
- Copy action without feedback.
- Delete or revoke without confirmation.
- Reveal that stays permanently visible.

## Process rules that the coding agent must not break

- Do not implement UI before `INTAKE.session.md` exists.
- Do not implement UI before `PRODUCT.md` exists.
- Do not implement UI before `DESIGN.md` exists.
- Do not implement UI before attempting `npx impeccable skills install` when shell access exists.
- Do not implement UI before the 2026 Standards Search Gate is completed or documented as unavailable.
- Do not implement UI when `node scripts/run-gates.mjs DESIGN.md PRODUCT.md src` reports blockers.
- Do not silently invent visual tokens during implementation. Extend `DESIGN.md` first.
- Do not use undocumented framework APIs or experimental browser features without checking current official docs or MDN Baseline.
