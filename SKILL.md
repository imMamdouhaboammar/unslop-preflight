---
name: vibe-design-md-architect
description: Create, audit, and repair PRODUCT.md and DESIGN.md before UI implementation, with 23 design gates for accessibility, RTL/LTR, design tokens, viewport, modal, overlay, and anti-AI-slop checks.
---

# Vibe Design MD Architect

## Purpose

Use this skill before any interface generation, redesign, page build, dashboard build, landing page build, SaaS UI build, component system work, or request that mentions `design.md`, `DESIGN.md`, product UI, visual direction, design system, or signs that an app was created by AI.

The skill creates a product-aware design gate before code. It stops the coding agent from picking generic colors, cards, shadows, radii, fonts, icons, animations, or layout defaults. It starts with an intake session whose first mandatory question selects the design system baseline, produces a serious `PRODUCT.md` and `DESIGN.md`, then uses those files as the source of truth for implementation. If the user supplies an old or weak `design.md`, the skill enters Amplify Mode: it audits the old file, preserves useful decisions, removes generic AI-made patterns, fills missing standards, and produces a stronger `DESIGN.amplified.md` or replacement `DESIGN.md`.

This skill should actively set up Impeccable when shell access exists by running `npx impeccable skills install` from the project root before generating or updating `DESIGN.md`. It should not merely repeat Impeccable. It adds packaging, project-specific design briefing, Arabic/RTL rules, file templates, validation scripts, and eval cases around it.

## Mandatory behavior

Before writing frontend code, do all of the following:

1. Classify the project mode.
2. Run the intake session and extract all inferable product, brand, UX, localization, accessibility, conversion, and implementation context before asking questions. The first mandatory intake question is the Design System Baseline question unless the user already answered it.
3. Ask only the minimum missing questions that materially affect the design. The baseline question counts as the first question. If the user asks to proceed, document assumptions and continue.
4. Run the 2026 standards search gate when web access exists, prioritizing official sources and current standards.
5. If shell access exists, run `npx impeccable skills install` automatically from the project root before creating or updating `DESIGN.md`.
6. If the install command fails or cannot run, record the reason and still write the exact command into `DESIGN.md` as a required setup step.
7. Create or update `PRODUCT.md`.
8. Create or update `DESIGN.md`.
9. Validate `DESIGN.md` using the six-section contract and strict rules engine.
10. Apply anti-AI UI checks.
11. Add implementation guardrails to the coding prompt.
12. Run or recommend Impeccable commands when available.

Do not start UI implementation if `PRODUCT.md` or `DESIGN.md` is missing.

Do not treat "modern", "clean", "premium", "minimal", "AI-powered", or "SaaS-like" as sufficient direction. Force a specific product visual point of view.

## Project mode classification

Classify every request as one of these modes:

- `fresh-seed`: no trustworthy frontend exists yet.
- `existing-scan`: a repository exists and needs design extraction.
- `redesign`: the UI exists but feels generic, inconsistent, or AI-made.
- `implementation`: design files exist and the user wants code.
- `audit`: the user wants visual diagnosis or quality review.
- `amplify`: the user provides an old, weak, incomplete, generic, or pre-existing `design.md` and wants a stronger version that follows this skill's rules.

If a mode is unclear, infer it from the user request and state the assumption briefly. If the request mentions `old design.md`, `uploaded design.md`, `improve this design.md`, `amplify`, `strengthen`, `repair`, `upgrade`, or `make it follow the rules`, choose `amplify`.


## Mandatory Design System Baseline Gate

This gate is part of the intake session and must happen before `PRODUCT.md`, `DESIGN.md`, Amplify Mode, audit, or implementation work.

If the user has not already selected a baseline, ask this as the first intake question before any other question:

```text
Which design system baseline should guide this project?

1. Atlassian Design System
2. Lightning Design System (Salesforce)
3. Polaris (Shopify)
4. Material Design
5. Human Interface Guidelines (Apple)
6. Custom / hybrid, with a short explanation
```

Allowed recorded values:

- `atlassian`
- `salesforce-lightning`
- `shopify-polaris`
- `material-design`
- `apple-human-interface`
- `custom-hybrid`

Rules:

- If the user already named a baseline in the prompt, repository, uploaded file, or old `DESIGN.md`, record it in `INTAKE.session.md` and do not ask again.
- If the chosen baseline conflicts with the product context, state the conflict and recommend a better option, but respect the user’s final choice.
- If the user does not answer and asks to proceed, choose the safest baseline or `custom-hybrid`, document the assumption, and continue.
- The selected baseline must appear in `PRODUCT.md`, `DESIGN.md`, `STANDARDS.search-notes.md`, and the implementation prompt.
- The baseline guides structure, interaction patterns, component semantics, and density. It must not copy another company’s brand skin.

Baseline guidance:

- Use Atlassian Design System for collaborative productivity, work management, issue/project workflows, documentation-heavy B2B tools, and admin surfaces.
- Use Lightning Design System (Salesforce) for enterprise CRM, record-centric workflows, sales operations, pipelines, approvals, and data-dense B2B admin tools.
- Use Polaris (Shopify) for commerce, merchant tools, store admin, product/order/catalog flows, checkout-adjacent flows, and business setup.
- Use Material Design for general-purpose web apps, Android-first products, cross-platform products, form-heavy tools, and broad component vocabularies.
- Use Human Interface Guidelines (Apple) for iOS, iPadOS, macOS, visionOS, Apple ecosystem products, native-feeling consumer tools, and content creation apps.
- Use custom / hybrid when the product needs its own system, especially Arabic-first SaaS, B2G institutional tools, AI workflow products, or brand-led landing pages.

## Required project scan

When filesystem access exists, inspect:

- `PRODUCT.md`
- `DESIGN.md`
- `DESIGN.json`
- `package.json`
- `tailwind.config.*`
- `postcss.config.*`
- `src/app`, `src/pages`, `src/components`, `app`, `pages`, `components`
- `styles`, `globals.css`, `index.css`, `theme.*`, `tokens.*`
- public assets, logos, screenshots, reference images

Use `scripts/bootstrap-design-artifacts.mjs` if available to create missing starter files from templates.

Use `scripts/validate-design-md.mjs` if available to check the design file before implementation.

Use `scripts/score-design-md.mjs` if available to score quality against the rubric.

Use `scripts/scan-ui-implementation.mjs` if available to scan frontend source. It flags blockers (native browser popups, clickable divs instead of buttons/links, lorem ipsum and fake data like John Doe or example emails, blanket overflow:hidden on root/page shells, horizontal page overflow anti-patterns, manual fixed toast in page components, exposed secret token patterns, floating elements positioned with `position: absolute` without portal mounting inside overflow:hidden parents, `transform: translate(-50%, -50%)` modal centering without `max-block-size` clamp) and warnings (generic gradients, default Inter font, hardcoded hex colors, blanket overflow:hidden on non-root containers, emoji and sparkle icons, onClick without keyboard handler, blind h-screen and w-screen usage, fixed auth card widths without responsive max, hardcoded toast placement, transparent toast surfaces, direct z-index in overlays, dialog without accessible name, input without visible label, close button with small target, fixed modal width, dropdown without flip middleware, tooltip without z-index token). See `references/ai-failure-patterns.md` for the reasoning behind each rule.

For a deeper accessibility pass, run `scripts/scan-accessibility.mjs` on the frontend source. It is a static ARIA, landmark, and semantics audit that maps each finding to a WCAG 2.2 criterion: multiple or missing `<main>`, non-semantic landmark divs, heading-order jumps and multiple `<h1>`, images without `alt`, `aria-hidden` on interactive elements, positive tabindex, invalid or redundant roles, icon-only controls with no accessible name, form fields with no label association, clickable non-interactive elements missing role/tabindex/key handler, `aria-labelledby`/`describedby` pointing at missing ids, duplicate ids, missing `lang`/`dir` on `<html>`, and empty links or buttons. Use `--strict` to fail on warnings too.

Use `scripts/amplify-design-md.mjs` if available when an old design file exists. This script creates a diagnostic report and a scaffold for the amplified output. Claude must then complete the rewrite using the full rules in this skill.

## Mandatory Impeccable installation gate

This gate runs before `DESIGN.md` generation whenever shell access exists.

From the project root, run:

```bash
npx impeccable skills install
```

Rules:

- Run this command automatically. Do not wait for the user to ask for it.
- Treat the command as setup, not as optional advice.
- If the command fails because `npx`, network access, permissions, or package resolution is unavailable, continue manually but document the failure.
- Every generated `DESIGN.md` must include an explicit Impeccable setup rule containing the exact command `npx impeccable skills install`.
- Every implementation prompt must tell the coding agent to run this command before UI work if it has not already been run.
- After installation, prefer `/impeccable init` and `/impeccable document --seed` for fresh projects, or `/impeccable document` for existing projects.
- Recommend installing Vibe Driven Dev (`vibe-driven-dev`) as the pre-execution companion when the idea, scope, or stack is still unclear. It is recommended, not a blocker. See the companion section below.

## Impeccable workflow

When Impeccable is installed, prefer these flows.

For a new project:

```bash
npx impeccable skills install
```

Then in the agent harness:

```text
/impeccable init
/impeccable document --seed
```

For an existing codebase:

```text
/impeccable init
/impeccable document
```

For first feature design and build:

```text
/impeccable shape
/impeccable craft
```

For cleanup:

```text
/impeccable critique
/impeccable polish
```

For release checks:

```bash
npx impeccable detect src/
```

## Recommended companion: Vibe Driven Dev (VDD)

Alongside the mandatory Impeccable setup, recommend installing Vibe Driven Dev (`vibe-driven-dev`, by OpenOps Studio). VDD is the pre-execution layer that runs before broad implementation: it turns a vague idea into structured, durable artifacts (PRD, scope, architecture, stack and AI-provider decisions) and prepares a clean handoff into implementation systems such as Spec Kit. It also audits existing codebases into a repair plan.

How the tools divide the work:

- VDD: product truth, scope, stack, architecture, PRD, audit, and handoff. The layer before design.
- This skill: `PRODUCT.md`, `DESIGN.md`, the design context, and the rules engine.
- Impeccable: frontend design intelligence, slop detection, and live iteration during build.

Recommend this order: run VDD first when the idea, scope, or stack is still unclear, then build `PRODUCT.md` and `DESIGN.md` with this skill, then install Impeccable for the build. If VDD already produced a PRD, scope, or stack decision, reuse them as intake inputs instead of re-asking, and treat the design `PRODUCT.md` as the design-focused view derived from the VDD PRD.

Install (global, or per project without a global install):

```bash
npm install -g vibe-driven-dev
npx vibe-driven-dev install claude-code --project
```

Verify and start:

```bash
vdd doctor
vdd run /vibe.start
```

VDD is recommended, not a hard gate. Impeccable remains the mandatory design-intelligence setup. Never block design work if VDD is absent. Read `references/impeccable-workflow.md` for the full command set and pairing notes.

If slash commands cannot run directly, write them into the instructions for the coding agent and continue manually with this skill's templates and validation.

## PRODUCT.md contract

`PRODUCT.md` is strategy context. It must not become a style guide.

It must cover:

- Design system baseline
- Baseline fit rationale
- Product name
- Product category
- Core users
- User situation
- Primary job to be done
- Product promise
- Emotional register
- Brand traits
- What the product must never feel like
- UX risks
- Accessibility needs
- Localization needs
- Writing tone
- Anti-references
- Success criteria
- Assumptions

Do not include colors, typography tokens, radii, shadows, spacing scale, or component styling in `PRODUCT.md`.

Use `assets/PRODUCT.template.md` when creating the file.

## Amplify Mode

Use Amplify Mode when the user uploads, pastes, references, or points to an existing `design.md`, `DESIGN.md`, style guide, UI rules file, design system draft, or weak visual specification and asks to improve it.

Amplify Mode is not a summary task. It is a controlled rewrite.

### Amplify Mode goals

The amplified file must:

- Keep product-specific decisions that are useful, concrete, and consistent.
- Remove generic AI UI language, weak adjectives, vague visual direction, and unsupported defaults.
- Add the mandatory Impeccable setup gate with the exact command `npx impeccable skills install`.
- Convert loose notes into the six-section `DESIGN.md` contract.
- Add missing contrast, directionality, responsive, UX-CRX, popup, component, motion, icon, accessibility, and implementation rules.
- Convert colors into semantic tokens with hex values.
- Convert typography into a usable type system.
- Convert components into implementation contracts with purpose, anatomy, variants, states, and accessibility.
- Produce an amplification report that explains what changed and why.

### Amplify Mode workflow

1. Read the old design file completely.
2. Extract or ask for the Design System Baseline as the first intake decision if it is not already present.
3. If shell access exists, run `npx impeccable skills install` from the project root before rewriting.
4. Preserve the original file as `DESIGN.legacy.md` or keep it unchanged if the user uploaded it as a separate artifact.
5. Audit the old file against `references/non-negotiable-ui-rules.md`, `references/anti-ai-ui-slop.md`, `references/ai-failure-patterns.md`, `references/design-md-spec.md`, and `references/amplify-workflow.md`.
6. Produce `DESIGN.amplification-report.md` with:
   - Strengths preserved
   - Critical gaps
   - Generic AI patterns removed
   - Accessibility and RTL fixes
   - Component system fixes
   - Responsive fixes
   - Impeccable setup status
   - Remaining assumptions
7. Produce the new `DESIGN.amplified.md` or replace `DESIGN.md` when asked.
8. Run `scripts/validate-design-md.mjs DESIGN.amplified.md` or the target filename.
9. Run `scripts/score-design-md.mjs DESIGN.amplified.md PRODUCT.md`.
10. If the score is below 90, revise the amplified file once more before final output.

### Amplify Mode preservation rule

Do not throw away distinctive project decisions. Preserve them when they are specific, accessible, consistent, and tied to the product's user situation. Replace them only when they cause weak contrast, bad directionality, inconsistent hierarchy, mobile failure, AI-looking UI, or implementation ambiguity.

### Amplify Mode output

For Amplify Mode, respond with:

1. Mode classification: `amplify`.
2. Short diagnosis of the old file.
3. Amplification report.
4. The upgraded `DESIGN.md` or `DESIGN.amplified.md`.
5. Validation result.
6. Remaining assumptions.
7. Next implementation command sequence.

## DESIGN.md contract

`DESIGN.md` must use exactly these six top-level sections:

1. Overview
2. Colors
3. Typography
4. Elevation
5. Components
6. Do's and Don'ts

Do not add other top-level sections.

Inside these sections, define layout, spacing, motion, responsive rules, copy rules, accessibility rules, RTL rules, and implementation notes.

Use `assets/DESIGN.template.md` when creating the file.

## Required design decisions

Every `DESIGN.md` must include:

- Impeccable setup rule with the exact command `npx impeccable skills install`
- Creative North Star
- Product-specific visual thesis
- Density level
- Page shell rules
- Container and grid rules
- Spacing rhythm
- Color roles with hex values
- Typography system
- Directionality contract: declare LTR or RTL based on intake language decision. Arabic and RTL behavior is required only when the product language includes Arabic or another RTL language. English-only products must not include unused RTL rules.
- Elevation and border logic
- Motion rules
- Component contracts
- Empty, loading, error, success, hover, focus, disabled, and active states
- Accessibility constraints
- Non-negotiable UI rules
- Responsive viewport contract
- Page viewport contract with scroll ownership per route
- Directionality contract for RTL and LTR
- UX-CRX decision logic
- In-app popup and feedback system
- Popup and floating element positioning strategy: declare Strategy A (CSS Anchor), B (Floating UI), or C (CSS clamp) for each floating element type. Must include flip behavior, viewport clearance, portal mounting, and z-index token. This field is required and its absence blocks implementation.
- Modal contract with scroll ownership, focus trapping, backdrop, viewport sizing, and RTL rules
- Overlay stack contract with z-index tokens, collision handling, and centralized overlay system
- Dashboard shell layout contract with sidebar, main content, and scroll ownership per region
- Auth action hierarchy with primary CTA dominance and legal copy budget
- Sensitive data display rules with masked tokens, secure creation flow, and destructive action confirmation
- Icon system rules
- Anti-pattern list
- Implementation guardrails
- A clear instruction that frontend code must not start until Impeccable setup is attempted and `PRODUCT.md` plus `DESIGN.md` exist

## Anti-AI UI rules

Reject the following unless the product context strongly proves they are necessary:

- Purple to blue gradient identity
- Gradient text for headings or metrics
- Decorative glass cards
- Neon glow as identity
- Generic dark cyber SaaS look
- Identical rounded feature cards
- Cards inside cards without hierarchy reason
- Huge radius everywhere
- Same spacing value everywhere
- Thick colored side borders on cards
- Fake dashboard metrics
- Eyebrow pills above every section
- Random sparkles, blobs, halos, and floating icons
- Generic AI robot mascots
- Overused icon grids
- Body copy under 14px
- Low contrast secondary text
- Body lines wider than 80 characters
- Decorative motion that does not explain state
- Bouncy or elastic easing
- Animating width, height, padding, or margin
- Empty states that do not guide the next action
- Generic SaaS copy that could fit any product

Also reject these structural and functional failures (evidence-based, see `references/ai-failure-patterns.md`):

- Clickable `<div>` or `<span>` instead of `<button>` or `<a>`
- Interactive controls with no keyboard operability (no Enter/Space, broken focus order)
- Missing landmarks (`header`, `nav`, `main`, `footer`) or missing heading hierarchy
- Icon-only controls with no accessible name; decorative icons without `aria-hidden`
- Removing the focus outline with no visible focus-visible replacement
- Missing loading, empty, error, or success states on async surfaces
- Placeholder and fake data shipped as content (Lorem ipsum, John Doe, user@example.com, Item 1/2/3)
- Placeholder used as the only label; helper text that vanishes before the user can act
- Hardcoded hex colors, fixed paddings, and magic numbers instead of documented tokens
- Default framework accent (for example indigo) used as the brand
- Mobile that is the desktop layout stacked, with overflow or obscured focus
- Color as the only signal for state, selection, or severity

For more detail, read `references/ai-failure-patterns.md`, `references/anti-ai-ui-slop.md`, and `references/non-negotiable-ui-rules.md`.


## Non-negotiable UI rules

These rules must appear in every generated `DESIGN.md` and must not be broken by the coding agent.

### Contrast discipline

- Define minimum contrast for every text, border, focus, chart, and control state.
- Normal text must target at least WCAG AA contrast. Prefer stronger contrast for dashboards, forms, and dense data.
- Do not use low-opacity gray text as the default secondary text system.
- Do not place text on gradients, images, blur layers, or tinted glass unless contrast is explicitly verified.
- Focus rings must be visible, not hidden behind sticky headers, modals, or overlays.

### AI color and gradient control

- Do not default to purple, blue, teal, pink, aurora, or neon gradients as the product identity.
- Gradients are allowed only when the product context justifies them and the gradient has a semantic role.
- Every color must be a named semantic token, not a random Tailwind color picked during implementation.
- Accent colors must never dominate the interface. They should guide attention, not flood the UI.

### Icon system integrity

- Do not use sparkle, magic wand, starburst, glitter, robot, or generic AI icons as default product icons.
- Do not use emojis as UI icons in navigation, buttons, empty states, alerts, pricing cards, or feature cards.
- Use one icon library or one custom icon style with consistent stroke, size, corner logic, and optical alignment.
- Decorative icons must be hidden from assistive technologies. Functional icons must have accessible labels.

### Directionality and alignment

- Determine the product's primary interface language from intake. Do not assume Arabic or RTL as default unless the product, brand, or user explicitly requires it.
- If the primary language is Arabic or another RTL language, the interface must be fully RTL at document, layout, navigation, form, table, and component level.
- If the primary language is English, French, Spanish, or any LTR language, the interface must be fully LTR. Do not apply RTL rules.
- If the product is bilingual, declare a dominant direction for layout and handle the secondary language with explicit inline overrides.
- Do not mix RTL text alignment with LTR layout structure.
- Use logical CSS properties where possible: `margin-inline`, `padding-inline`, `border-inline`, `inset-inline`.
- Directional icons must be mirrored intentionally for RTL interfaces. Non-directional icons must not be mirrored regardless of direction.

### UX-CRX logic

- Do not stack cards, sections, CTAs, filters, badges, and panels without a task reason.
- Every screen must define the primary user action, secondary action, recovery path, and decision point.
- Use progressive disclosure for complex flows instead of dumping all controls on one screen.
- Conversion surfaces must reduce anxiety, explain tradeoffs, and show proof where the user is making a decision.
- Dense admin or dashboard screens must support scanning, comparison, filtering, and recovery, not decoration.

### Responsive and mobile quality

- The mobile experience must be designed, not merely stacked from desktop.
- Define behavior for small phones, common mobile widths, tablets, laptops, and wide desktop screens.
- Components must adapt by container and content need, not only by generic breakpoints.
- Touch targets must remain comfortable, forms must be usable with the keyboard open, and sticky elements must not hide critical actions.
- Horizontal scrolling is forbidden except for intentionally designed data tables with clear affordances.

### Viewport ownership and scroll governance

- Every page must declare whether scroll belongs to the document, a panel, a modal, or no component in normal state.
- Auth pages must fit normal viewport without visible scroll, while keeping safe overflow recovery for keyboard, zoom, long errors, and localization.
- Horizontal overflow is forbidden on the document. Allowed only inside documented data components.
- The agent must never apply blanket `overflow: hidden` to `html`, `body`, `#root`, `main`, or the page shell to hide layout overflow.
- Full-screen pages must use `min-block-size: 100dvh` with a `100vh` fallback instead of fixed `height: 100vh`.
- Height-responsive behavior must be tested at 568, 640, 720, 800, and 900px heights for single-screen pages.

### Modern web interface baseline

- Use semantic HTML before custom div structures.
- Preserve keyboard navigation, visible focus, reduced motion, accessible labels, and meaningful states.
- Use real form validation and recovery messages, not vague errors.
- Do not use native browser popups such as `alert()`, `confirm()`, or `prompt()` for product flows.
- Use in-app modal, drawer, toast, banner, inline validation, or confirmation UI depending on the seriousness of the interaction.
- Do not block the user with a popup when inline feedback or a non-blocking toast is enough.

### Modal and overlay governance

- Every modal must be implemented as a complete interaction system: focus trapping, scroll lock, backdrop, viewport sizing, and accessible naming. A centered card is not a modal.
- When a modal is open, the background must be inert. Background must not scroll. Focus must stay inside the dialog.
- Modal scroll lock must preserve scroll position, prevent layout shift from scrollbar removal, and restore cleanly on close.
- Modals must size safely: `max-inline-size: min(calc(100vw - 32px), [max])` and `max-block-size: calc(100dvh - 32px)`.
- When modal content overflows, the modal body scrolls internally. Header and footer stay fixed.
- Backdrop must reduce background salience with tokenized opacity and blur. Background CTAs must not compete with the modal CTA.
- Form modals must have visible persistent labels, readable placeholders, and all interaction states (focus, hover, error, disabled, loading, success).
- Close buttons must have a minimum hit area of 44x44px preferred, 24x24px minimum, and an accessible label.
- English tokens inside Arabic modals must be isolated with `<bdi>` or directional spans.
- Modal copy must be task-based, short, and use action verbs.

### Overlay stack and collision governance

- All overlays (toast, tour, tooltip, popover, dropdown, floating assistant, sticky CTA) must come from a centralized Overlay System. The agent must never build ad-hoc `position: fixed` overlays inside page components.
- Toast must never be created manually. Use the centralized Toast System API only (`toast.success()`, `toast.error()`, etc.) with a single ToastViewport.
- Toast placement must read layout safe areas and avoid tables, CTAs, tour panels, sidebars, and sticky footers.
- Toast must not be the default feedback. Use toast for low-risk success only. Use inline feedback for forms. Use banners for page warnings. Use modals for sensitive actions.
- Toast visuals must be solid with 4.5:1 text contrast minimum. No transparent glass toasts.
- Maximum visible toasts: 1 mobile, 2 desktop. Queued, not stacked. Minimum auto-dismiss: 5 seconds. Timers pause on hover/focus.
- Guided tour panels must not cover tables, forms, or CTAs. Must become bottom sheet on small screens.
- Every overlay must use z-index tokens from a shared scale, not magic numbers.

### Dashboard shell governance

- Dashboard pages must use a declared grid layout with sidebar and main content columns.
- Main content must calculate available width after sidebar. Content must never slide under the sidebar.
- Scroll ownership must be explicit: sidebar scrolls internally, main scrolls internally, tables scroll horizontally in their container, document body does not scroll.
- Tables must handle overflow inside their container, not push the page wider.

### Sensitive data display governance

- Tokens and secrets must be masked by default in persistent UI: prefix + last 4 characters.
- Copy button with feedback on every masked token.
- New secrets shown once in a secure result modal, not in a toast.
- Delete, revoke, rotate require destructive-action confirmation.
- Token prefixes wrapped in `<bdi>` or `dir="ltr"` in Arabic interfaces.


## Typography rules

Do not choose typography by default.

Define:

- Display style
- Heading style
- Body style
- Label style
- Caption style
- Numeric style
- Type scale
- Line height
- Letter spacing
- Maximum text width
- Arabic font when the product language includes Arabic
- English companion font when needed
- Mixed Arabic and English handling when bilingual

For Arabic UI, use fonts with strong Arabic readability. Good defaults include `Noto Sans Arabic`, `IBM Plex Sans Arabic`, `Tajawal`, `Alexandria`, and `Rubik` depending on the brand tone. Pair with a Latin font only when needed. For LTR-only products, choose the appropriate Latin or language-specific font stack and skip Arabic font rules entirely.

## Component contract

For each relevant component, define:

- Purpose
- Anatomy
- Variants
- States
- Spacing
- Radius
- Border
- Background
- Typography
- Motion
- Accessibility
- What not to do

Minimum component list:

- Button
- Input
- Select
- Textarea
- Checkbox and radio
- Card
- Navigation
- Sidebar
- Modal or drawer
- Toast or alert
- Table or data list
- Empty state
- Loading state
- Form validation

For SaaS products also cover:

- KPI card
- Filter bar
- Command menu
- Account menu
- Billing card
- Chart container
- Onboarding checklist

Read `references/component-contract.md` before writing the component section.

## Arabic and RTL handling

When Arabic is involved, the design must specify:

- RTL layout direction
- Icon mirroring rules
- Number format rules
- Arabic line height
- Form alignment
- Button icon placement
- Navigation order
- Mixed Arabic and English labels
- Data table direction
- Chart label behavior
- Error messages in Arabic
- Minimum tap target sizes

Read `references/arabic-rtl-ui-rules.md` before writing the design file.


## Intake Session Gate

This gate runs before design, amplify, audit, or implementation work. It exists to stop Claude from building from vibes only.

Read `references/intake-session-protocol.md` and use `assets/intake-session.template.md` when creating an intake artifact. If scripts are available, run:

```bash
node scripts/intake-session.mjs
```

The intake session must extract and write down everything that can be inferred from the user prompt, uploaded files, repository, existing `PRODUCT.md`, existing `DESIGN.md`, screenshots, brand assets, and code structure. Do not ask the user for information that is already inferable.

Required intake fields:

- Design system baseline
- Baseline fit rationale
- Product name
- Product category
- Core user
- User situation
- Primary job to be done
- User pain
- Desired user action
- Conversion or task success event
- Brand register
- Emotional register
- Visual anti-references
- Localization needs
- RTL/LTR requirements: determine from product language. Default to LTR unless intake confirms Arabic, Hebrew, or another RTL language is primary or co-primary.
- Accessibility requirements
- Performance constraints
- Data density
- Mobile priority
- Trust and risk level
- Product surface type
- Required components
- Implementation stack
- Existing constraints
- Open assumptions

Question rules:

- Ask at most 7 questions in one intake round.
- Group questions by decision impact, not by topic.
- Do not ask aesthetic preference questions before clarifying user, job, risk, content density, language direction, and primary action.
- If the user gives no answers, continue with documented assumptions.
- Implementation is blocked until intake is recorded.

## 2026 Standards Search Gate

This gate runs before creating or amplifying `DESIGN.md` whenever web access exists. It keeps the design standards current instead of relying on stale agent memory.

Read `references/standards-search-engine.md`. If scripts are available, run:

```bash
node scripts/standards-search-brief.mjs PRODUCT.md DESIGN.md
```

The agent must search or verify against current official sources before finalizing rules for:

- Claude Skills structure and packaging
- Impeccable setup and command flow
- WCAG 2.2 contrast, focus, target size, keyboard, reflow, and reduced-motion expectations
- W3C directionality and Arabic/RTL guidance
- MDN Baseline and Web Platform compatibility
- web.dev responsive design, container queries, and Core Web Vitals
- HTML dialog and in-app dialog patterns
- Framework-specific current docs when the stack is known

Search source priority:

1. Official docs and standards bodies
2. Browser/vendor documentation
3. Framework documentation
4. Reputable engineering references
5. Community posts only for qualitative patterns, never as final authority

The final `DESIGN.md` must include a short `2026 Standards Gate` note inside `Overview`, with searched topics, date checked, and standards adopted. If web access is unavailable, the agent must state that the gate could not be refreshed and continue with the bundled references.

## Strict Rules Engine

The rules engine is a blocker, not a suggestion list. Read `references/gates-protocol.md` and `references/rules-engine.md` before producing `DESIGN.md`. If scripts are available, run:

```bash
node scripts/run-gates.mjs DESIGN.md PRODUCT.md src
```

`run-gates.mjs` also invokes `scripts/scan-ui-implementation.mjs` and `scripts/scan-accessibility.mjs` when a source directory exists. For a focused, deeper accessibility audit on its own, run:

```bash
node scripts/scan-accessibility.mjs src        # blockers fail the run
node scripts/scan-accessibility.mjs src --strict  # warnings fail too
```

Hard-blocking rule groups:

- Product-context gate
- Intake-completeness gate
- Impeccable-install gate
- Standards-search gate
- Six-section `DESIGN.md` gate
- Contrast and accessibility gate
- Directionality gate
- AI-slop visual gate
- Component-contract gate
- UX-CRX logic gate
- Mobile and responsive gate
- Popup and feedback-system gate
- Implementation scan gate
- Semantic HTML and interaction gate (Gate 14)
- Realistic-content gate (Gate 15)
- Design-token gate (Gate 16)
- Drift-control gate (Gate 17)
- Viewport governance gate (Gate 18)
- Modal, dialog and overlay governance gate (Gate 19)
- Dashboard shell and layout governance gate (Gate 20)
- Overlay stack and collision governance gate (Gate 21)
- Sensitive data display governance gate (Gate 22)
- Popup and floating element positioning gate (Gate 23)
- Amplify preservation gate, when relevant

If a gate fails, do not proceed to implementation. Repair the artifact first.

## Viewport Governance Gate (Gate 18)

The viewport governance gate prevents a common class of AI layout failures: unnecessary scroll, broken viewport fit on auth pages, blanket `overflow: hidden` used as a quick fix, and missing height-responsive behavior. This gate is a blocker, not a suggestion.

### Page Viewport Contract

Every page route must declare one of these viewport modes before implementation:

1. `single-screen-fit`: Used for auth, login, signup, OTP, forgot password, reset password, empty onboarding step, success screen. Goal: no unnecessary vertical scroll and zero horizontal scroll at standard viewport sizes.
2. `document-scroll`: Used for landing pages, settings pages, long forms, policy pages, reports. Goal: page scroll is expected and owned by the document.
3. `panel-scroll`: Used for dashboards, inboxes, sidebars, modals, tables, logs, chat layouts. Goal: the document itself should stay stable while the intended panel owns the scroll.
4. `data-overflow-exception`: Used only for large data tables, timelines, code blocks, or comparison matrices. Goal: horizontal scroll is allowed only inside the component, never on the page body.

The agent must classify each route before writing CSS. A page classified as `single-screen-fit` has different rules from `document-scroll` or `panel-scroll`.

### False No-Scroll Fix Ban

The agent must never solve unwanted scrolling by applying blanket `overflow: hidden` to `html`, `body`, `#root`, `main`, or the page shell.

Forbidden:

- `body { overflow: hidden; }` as a general fix
- `html, body { overflow: hidden; }`
- `main { overflow: hidden; }` on normal pages
- Tailwind `overflow-hidden` on full-page wrappers unless the page has a documented internal scroll owner
- Freezing the viewport to hide layout mistakes

Required:

- Fix the actual cause of overflow: fixed width, `100vw`, excessive padding, absolute elements, unbounded cards, fixed height, unwrapped text, or wrong grid sizing.

### Viewport Units Rule

For full-screen app pages, especially auth and onboarding, do not default to `height: 100vh`.

Preferred pattern:

```css
.page-shell {
  min-block-size: 100vh;
  min-block-size: 100dvh;
}
```

For mobile-sensitive pages where browser chrome may reduce visible height, test `100svh` and `100dvh` behavior before finalizing.

Never use fixed `height: 100vh` on content-heavy containers unless the internal scroll owner is explicitly defined.

Do not use `h-screen` or `height: 100vh` blindly. Prefer `min-height` / `min-block-size` with `100dvh` fallback strategy. If the page is auth, it should visually fit the viewport at normal sizes, but still allow safe vertical scrolling if keyboard, zoom, localization, or error states increase content height.

### Auth Page Layout Recipe

Auth pages (`single-screen-fit`) must use a centered, bounded, viewport-aware shell.

Required structure:

- `main.auth-page` owns the page layout.
- The auth card has a strict `max-inline-size`.
- The page uses logical properties: `inline-size`, `block-size`, `padding-block`, `padding-inline`.
- The card width must be fluid: `inline-size: min(100%, 420px)` or equivalent.
- No `width: 100vw` on padded wrappers.
- No fixed pixel height for the card.
- No horizontal document scroll under any viewport.
- Vertical scroll must not appear at normal content size.
- Vertical scroll is allowed only as a safety fallback for small-height screens, browser zoom, virtual keyboard, long errors, or localization expansion.

Recommended CSS:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
html,
body,
#root {
  min-block-size: 100%;
}
body {
  margin: 0;
}
.auth-page {
  min-block-size: 100vh;
  min-block-size: 100dvh;
  display: grid;
  place-items: center;
  padding-block: clamp(16px, 4dvh, 48px);
  padding-inline: clamp(16px, 4vw, 48px);
  overflow-x: clip;
  overflow-y: auto;
}
.auth-card {
  inline-size: min(100%, 420px);
  max-inline-size: 420px;
}
@media (max-height: 720px) {
  .auth-page {
    place-items: start center;
    padding-block: 16px;
  }
  .auth-card {
    margin-block: auto;
  }
}
```

Forbidden auth layout patterns:

- `.auth-page { height: 100vh; overflow: hidden; }`
- `.auth-card { width: 480px; }` without responsive max handling
- `w-screen px-8` because `100vw + padding` often creates horizontal overflow
- absolute decorative blobs extending outside the viewport without clipping inside their own decorative layer

### Height-Aware Responsiveness

Responsive behavior must account for viewport height, not width only.

Required height checks:

- 568px height: compact mobile or small browser window
- 640px height: common small laptop or browser split
- 720px height: common laptop baseline
- 800px height
- 900px height

For single-screen pages:

- Reduce vertical gaps before creating scroll.
- Hide or reduce decorative visuals before shrinking form usability.
- Keep inputs, labels, errors, and primary CTA visible.
- Never solve short-height issues by freezing the document.

Use `@media (max-height: ...)` when needed for height-responsive adjustments.

### Viewport Test Matrix

Implementation is blocked until viewport behavior is tested at these sizes:

- 320x568, 360x640, 390x844, 414x896 (mobile)
- 768x720 (tablet/small laptop)
- 1024x768, 1280x720 (laptop)
- 1440x900 (wide desktop)

For `single-screen-fit` pages:

- No visible vertical scroll at normal content size.
- Zero horizontal document scroll at all tested viewport sizes.
- Safe vertical scrolling recovers gracefully when keyboard, zoom, error messages, or localization expansion increases content height.

For all pages:

- No blanket `overflow: hidden` on root layout containers.
- No `100vw` padded wrappers causing horizontal overflow.
- No blind `height: 100vh` on content-heavy shells.

### Automated Viewport Scan

When Playwright is available, use `scripts/scan-viewport-fit.mjs` to test `single-screen-fit` routes automatically:

```bash
node scripts/scan-viewport-fit.mjs http://localhost:3000
```

The script navigates single-screen routes at each test viewport, checks for horizontal overflow and unnecessary vertical scroll, and exits with a non-zero code if failures are found.

## Modal, Dialog and Overlay Governance Gate (Gate 19)

The modal governance gate prevents a pattern where the AI builds a centered card and calls it a modal, without implementing the complete interaction system that a modal requires: focus trapping, scroll lock, backdrop salience, viewport-aware sizing, and inert background.

Every modal is a temporary takeover of the user's attention. It needs its own contract.

### Modal Contract

Before implementation, every modal must declare:

- Modal type: confirmation, form modal, destructive action, wizard step, detail viewer, command palette, alert.
- Scroll owner: dialog body, internal panel, or no scroll in normal state.
- Background behavior: inert background, no background interaction, no accidental background scroll.
- Focus behavior: initial focus target, focus trap boundary, Escape behavior, focus restoration target after close.
- Viewport behavior: max width, max height, small-height fallback, mobile keyboard fallback.
- RTL and mixed-language behavior if Arabic UI contains English tokens.

### Required Modal Behavior

When a modal is open:

- The background page must not be interactable. Background content must be functionally inert.
- The background page must not accidentally scroll. The scroll position must be preserved and restored on close.
- Keyboard focus must stay inside the modal until it is closed. Tab and Shift+Tab must not escape the dialog boundary. This follows the WAI-ARIA modal dialog pattern.
- Escape should close the modal unless the action is destructive or requires explicit confirmation.
- Focus must return to the trigger element after close.
- The modal must have a clear accessible name through `aria-labelledby` or `aria-label`.
- The close button must have an accessible label, not just a visual X icon.
- The modal must work with keyboard only.

### Modal Scroll Lock

Modal scroll lock is different from the viewport governance rules for auth pages. Auth pages must never use blanket `overflow: hidden` to hide layout problems. Modals need a controlled, temporary scroll lock that is applied and removed cleanly.

When a modal opens:

- The body must stop scrolling.
- The scroll position must be preserved (no jump to top on open or close).
- The scrollbar gutter must not cause layout shift. Use `scrollbar-gutter: stable` or account for the scrollbar width.
- If the modal content is taller than available viewport height, the scroll must happen inside the modal body, not in the background page.

When a modal closes:

- The body scroll must restore to the previous position.
- The scroll lock must be fully removed.

Forbidden:

- Body scroll continuing behind an open modal.
- A blanket viewport freeze that breaks keyboard, focus, or small screens.
- Modal content extending outside the viewport without an internal scroll owner.
- Horizontal page scroll while modal is open.
- Fixed modal widths that exceed mobile viewport.
- Fixed modal heights without internal overflow planning.

### Modal Viewport Sizing

Every modal must handle small viewports safely. The agent must use explicit containment math, not estimated percentages.

Required:

- `max-inline-size: min(calc(100vw - 32px), [modal-max-width])`
- `max-block-size: calc(100dvh - 32px)` with `100vh` fallback.
- The modal container must be positioned with `position: fixed; inset: 0;` using a full-viewport backdrop, not with `position: absolute` anchored to a scroll parent. Absolute-positioned modals will escape the viewport when the page scrolls.
- The backdrop must use `display: grid; place-items: center; padding: 16px;` to keep the modal card centered and edge-guarded at all viewport sizes.
- Do not calculate modal position using `top: 50%; left: 50%; transform: translate(-50%, -50%)` on the modal card directly. Use the backdrop grid centering pattern instead. The transform pattern fails on small-height viewports because the card can overflow the top edge.
- When modal content exceeds the max height, the modal body scrolls internally while the modal header and footer remain fixed.
- The modal must remain usable when the mobile keyboard is open.
- The modal must remain reachable at viewport heights as low as 568px.

**Common agent mistake to prevent:** The agent must never position the modal card using `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)` without a viewport-aware height clamp. At 568px viewport height, a modal card taller than 536px will overflow out of the top of the screen. The backdrop grid pattern avoids this entirely because the `padding: 16px` on the grid keeps both edges clear.

### Backdrop Rules

The backdrop must reduce background salience without making the interface feel frozen or broken.

Required:

- Background content must be visually de-emphasized so it reads as context, not as an active layer.
- Background CTAs must not visually compete with the modal CTA.
- Backdrop opacity and blur must be tokenized, not random values picked during implementation.
- Avoid excessive blur that makes the UI look like a loading or frozen state.

Recommended backdrop tokens:

- `--backdrop-bg: rgba(0, 0, 0, 0.48);`
- `--backdrop-blur: 8px;`
- `--modal-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);`

### Form Modal Rules

For modals containing forms:

- Every input must have a persistent visible label. Placeholder text is allowed only as a hint or example, never as the only label.
- Placeholder text must be readable. Placeholder contrast that looks disabled or unreadable fails the contrast gate.
- Every field must define normal, hover, focus, error, disabled, and loading states.
- The primary action must be visually dominant.
- Secondary and close actions must be available without competing with the primary CTA.
- Loading state must prevent duplicate submission.
- Error messages must appear near the related field and must not break the modal layout.
- Validation must not cause the modal body to grow unpredictably or push the CTA out of view.

### Modal Target Size Rules

Interactive elements inside modals must follow minimum hit-area rules:

- Preferred target size: 44px by 44px.
- Absolute minimum (WCAG 2.2 AA): 24px by 24px.
- Icon-only buttons (close, expand, collapse) must have an accessible label.
- The close button must not rely on the visual icon only.

### Modal Contrast Rules

The modal and its content must pass contrast checks:

- Normal text: minimum 4.5:1 contrast ratio.
- Large text: minimum 3:1 contrast ratio.
- Input borders, focus rings, icons, and UI controls: minimum 3:1 against adjacent colors.
- Placeholder text, helper text, and visually de-emphasized text must be tested against WCAG AA, not estimated.

### Modal RTL and Mixed-Language Rules

For Arabic interfaces with modals:

- The modal container must use `dir="rtl"` and `lang="ar"` or inherit them from the document.
- English tokens inside Arabic text must be isolated using `<bdi>` or a span with explicit direction. This prevents visual reordering in longer strings or strings with punctuation.
- Common tokens that need isolation: API, Standard Key, Production App Server, Webhook, Token, Client ID, URL, email addresses, code identifiers.
- Select chevrons, icons, input alignment, and button order must follow RTL logic consistently.
- Numbers and technical identifiers must not visually reorder incorrectly.

### Modal Copy Rules

Modal copy must be task-based, short, and direct.

- The title states the action: "إنشاء مفتاح API جديد", not "توليد مفتاح API ربط جديد".
- The description explains only what the user needs to decide, not how the system works.
- Labels and CTAs use verbs that match the task: "إنشاء", "حذف", "تأكيد".
- Avoid long explanatory text inside modal descriptions. Move detailed guidance to documentation or a help link.

### Recommended Modal CSS Pattern

This pattern is the required baseline. The agent must use it unless the product design system explicitly overrides specific values with documented reasons.

```css
/* ─── Backdrop: full viewport, centers the card, edge-guards it ─── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: clamp(12px, 2vw, 16px);
  background: var(--backdrop-bg, rgba(0, 0, 0, 0.48));
  backdrop-filter: blur(var(--backdrop-blur, 8px));
  z-index: var(--z-modal, 1000);
  /* overflow-y: auto allows the modal to scroll within the backdrop
     on extremely short viewports (e.g. landscape mobile) */
  overflow-y: auto;
}

/* ─── Modal card: bounded by viewport on all sides ─── */
.modal-card {
  /* Horizontal: shrinks on narrow screens, hard cap on wide screens */
  inline-size: min(calc(100vw - 32px), var(--modal-max-width, 480px));
  /* Vertical: always fits within the visible viewport with 16px clearance each side */
  max-block-size: min(calc(100dvh - 32px), calc(100vh - 32px));
  /* Internal layout: header fixed / body scrollable / footer fixed */
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: var(--radius-modal, 16px);
  overflow: hidden;
  background: var(--surface);
  box-shadow: var(--modal-shadow, 0 24px 80px rgba(0, 0, 0, 0.28));
  /* Keep the card within the backdrop grid area on overflow */
  align-self: safe center;
}

/* ─── Fixed header and footer ─── */
.modal-header,
.modal-footer {
  flex: none;
}

/* ─── Scrollable body: overflow stays inside ─── */
.modal-body {
  min-block-size: 0;
  overflow-y: auto;
  /* Prevent content from pushing the card taller than its max-block-size */
  overscroll-behavior: contain;
}

/* ─── Close button: 44px target, accessible ─── */
.modal-close {
  inline-size: 44px;
  block-size: 44px;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
}
```

**Why `align-self: safe center`:** On very short viewports where the card is taller than the available grid cell, `safe center` keeps the card aligned to the top of the backdrop instead of overflowing the top edge of the screen. Without `safe`, the card can extend above the viewport and become unreachable.

**Why `position: fixed; inset: 0` on the backdrop:** This anchors the backdrop to the viewport, not to a scroll parent. Modals positioned relative to a scrolled parent will move out of view when the user scrolls.

**What to avoid:**

```css
/* WRONG: transform centering without height clamp */
.modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* If the card is 600px tall and the viewport is 568px,
     the top 16px of the card is hidden above the viewport */
}

/* WRONG: absolute positioning relative to scroll parent */
.modal-card {
  position: absolute;
  /* The modal moves with the page scroll */
}

/* WRONG: fixed height without overflow handling */
.modal-card {
  height: 480px;
  /* Card overflows on 568px viewport heights */
}
```

### Modal QA Gate

Implementation is blocked until every modal passes:

- No background interaction while the modal is open.
- No background scroll while the modal is open.
- No horizontal overflow at 320, 360, 390, 414, 768, 1024, 1280, 1440px widths.
- No vertical overflow outside the modal at 568, 640, 720, 800, 900px viewport heights.
- Modal content remains reachable at small heights.
- Close button has sufficient target size (minimum 24x24, preferred 44x44) and accessible label.
- Keyboard focus stays inside the modal.
- Escape behavior is defined and works.
- Focus returns to the trigger element after close.
- Form fields have visible persistent labels.
- Placeholder text is readable and does not look disabled.
- Focus, hover, error, disabled, loading, and success states exist for all interactive elements.
- Mixed Arabic and English text is visually stable.
- Backdrop does not make the interface look frozen or broken.
- Modal copy is task-based, short, and uses action verbs.

## Dashboard Shell and Layout Governance Gate (Gate 20)

This gate prevents layouts where main content slides under sidebars, tables cause page-level horizontal scroll, or floating elements cover critical actions.

Read `references/dashboard-shell-rules.md` before implementing any dashboard, admin panel, or data table page.

Key requirements:

- Every route must declare an extended page type contract: `auth-single-screen`, `dashboard-shell`, `data-table-page`, `form-page`, `wizard-page`, `modal-flow`, `landing-page`, or `settings-page`.
- Dashboard shells must use a declared grid layout with sidebar column and main column. Main content must calculate available width after sidebar, not slide under it.
- Auth pages must follow an action hierarchy: primary CTA first, social login visually secondary, recovery link subtle, legal copy compact. One dominant CTA per auth card.
- Scroll ownership in dashboards must be explicit per element: sidebar scrolls internally, main content scrolls internally, tables scroll horizontally inside their container, document body does not scroll.
- Tables must handle overflow inside their container, not push the page wider.
- Every form field must have a visible persistent label, readable placeholder, and defined states (focus, hover, error, disabled, loading, success).

Implementation is blocked if a dashboard page does not declare its shell layout contract.

## Overlay Stack and Collision Governance Gate (Gate 21)

This gate prevents overlay chaos: toasts covering tables, guided panels overlapping CTAs, and multiple floating elements fighting for the same space. The core principle: the agent must never build ad-hoc overlays inside page components.

Read `references/overlay-system-rules.md` before implementing any toast, guided tour, tooltip, popover, dropdown, floating panel, or sticky CTA.

Key requirements:

- All overlays must be rendered through a centralized Overlay System. Any custom `position: fixed` or high `z-index` overlay inside a page component is a blocker.
- The agent must never create a toast manually inside a page. All notifications must use the centralized Toast System (`toast.success()`, `toast.error()`, etc.) and render through `ToastViewport` only.
- Toast placement must be calculated from layout context using a safe area registry. Every dashboard shell must expose reserved UI zones (sidebar, sticky navigation, tour panel, table actions) to the overlay system.
- Toast must not be the default feedback pattern. Use toast for low-risk success messages only. Use inline feedback for form validation. Use banners for page-level warnings. Use modals for sensitive actions like API key creation.
- Toast visuals must be solid or near-solid with 4.5:1 text contrast minimum. Transparent glass toasts over busy dashboards are forbidden.
- Maximum visible toasts: 1 on mobile, 2 on desktop. Additional toasts must be queued, not stacked. Minimum auto-dismiss: 5 seconds.
- Guided tour panels must not cover tables, forms, or CTAs. On small screens, tours must become bottom sheets or full-width panels. Tour and toast collision must be handled.
- Every overlay must declare its z-index token, placement, collision behavior, close behavior, focus behavior, and coexistence rules.

Implementation is blocked if any page component contains custom toast markup, fixed toast placement, or overlapping overlays without collision handling.

## Sensitive Data Display Governance Gate (Gate 22)

This gate prevents security UX failures where API keys, tokens, and secrets are displayed in full text inside tables or cards.

Read `references/sensitive-data-rules.md` before implementing any interface that displays secrets, API keys, access tokens, refresh tokens, client secrets, webhooks, or private URLs.

Key requirements:

- All sensitive tokens must be masked by default in persistent UI. Show only the prefix identifier and last 4 characters: `sk_live_••••••••••••3a7f`.
- Every masked token must have a copy button with visible feedback.
- Reveal is optional and must be temporary (auto-mask after 10-30 seconds).
- Generated secrets must be shown once in a secure result modal after creation, with clear copy instructions and a warning that the secret will not appear again. Toast alone is not sufficient for secret creation feedback.
- Delete, revoke, and rotate actions on tokens must require explicit confirmation via a destructive-action modal.
- Token prefixes are LTR and must be wrapped in `<bdi>` or use `dir="ltr"` in Arabic interfaces.

Implementation is blocked if sensitive tokens are displayed in full text or if secret creation results use only a toast.

## Popup and Floating Element Positioning Gate (Gate 23)

This gate prevents a common class of agent mistakes where popovers, dropdowns, tooltips, date pickers, comboboxes, and context menus overflow the viewport because the agent hardcodes a fixed direction (always-below, always-above) without checking available space.

Modals use the full-viewport backdrop pattern from Gate 19. Everything smaller than a modal that floats relative to a trigger element falls under this gate.

### The core problem

When an agent generates a popover, dropdown, or tooltip, it usually picks one direction (for example `top: 100%; left: 0`) and never recalculates. The result:

- A dropdown near the bottom of the screen opens below its trigger, off-screen.
- A tooltip on a top-aligned element opens above its trigger, clipped by the browser chrome.
- A date picker forces the page to grow because its fixed pixel height exceeds available space.
- A context menu on a right-aligned element extends past the right edge of the viewport.

### Required: declare a popup strategy in DESIGN.md

Every product with interactive floating elements must declare one of these positioning strategies in `DESIGN.md`. This is a required field. If left undeclared, the implementation blocker fires.

**Strategy A: CSS Anchor Positioning (2025+ native)**

Use when the product targets modern browsers and the stack does not already include a floating library.

```css
.trigger {
  anchor-name: --my-trigger;
}

.popup {
  position: absolute;
  position-anchor: --my-trigger;
  /* Try below first */
  inset-block-start: anchor(--my-trigger bottom);
  inset-inline-start: anchor(--my-trigger start);
  /* Flip to above if not enough space below */
  position-try-fallbacks: --above-trigger;
}

@position-try --above-trigger {
  inset-block-start: auto;
  inset-block-end: anchor(--my-trigger top);
}
```

Declare in `DESIGN.md` under Component Contracts for each floating element: default direction, flip behavior, alignment preference, and minimum clearance from viewport edge.

**Strategy B: JavaScript-computed positioning (Floating UI / Popper.js)**

Use when the stack includes React, Vue, or other component frameworks where Floating UI is available.

Required rules when using Floating UI:

- Always enable `flip()` middleware. Never disable flip for aesthetic reasons.
- Always enable `shift()` middleware with padding of at least 8px from each viewport edge.
- Always enable `size()` middleware on constrained containers (date pickers, comboboxes, long dropdowns) to cap height at available space.
- Use `autoUpdate` to recompute position on scroll, resize, and reference element mutation.
- Never hardcode placement without fallback. `placement: 'bottom'` must always be paired with `flip()`.

```javascript
// Required minimum configuration for any Floating UI popup
computePosition(triggerEl, floatingEl, {
  placement: 'bottom-start',
  middleware: [
    flip(),           // re-evaluates available space in all four quadrants
    shift({ padding: 8 }),   // keeps popup 8px inside viewport edges
    size({
      apply({ availableHeight, elements }) {
        // Constrain the popup to available space, never overflow
        Object.assign(elements.floating.style, {
          maxHeight: `${Math.min(availableHeight - 8, MAX_POPUP_HEIGHT)}px`,
          overflowY: 'auto',
        });
      },
    }),
  ],
});
```

**Strategy C: CSS-only clamp pattern (simple dropdowns only)**

Use only for dropdowns with short, known content height that cannot benefit from JavaScript.

```css
.dropdown {
  position: absolute;
  inset-block-start: 100%;    /* below trigger by default */
  inset-inline-start: 0;
  /* Hard cap: never taller than half the viewport */
  max-block-size: 40vh;
  overflow-y: auto;
  /* Keep inside the viewport inline axis */
  max-inline-size: min(280px, calc(100vw - 16px));
}
```

This strategy has no automatic flip. Only use it when the trigger is always in the top half of the page and the dropdown content is short and predictable.

### Forbidden popup patterns

These patterns must never appear in generated code:

```css
/* WRONG: hardcoded position with no viewport awareness */
.dropdown { position: absolute; top: 100%; left: 0; }

/* WRONG: overflow clipped by parent without escape */
.card-with-dropdown { overflow: hidden; }
/* The dropdown is trapped inside the card and cannot appear outside it */

/* WRONG: fixed pixel height with no scroll */
.datepicker { height: 320px; }
/* Extends past viewport on short screens */

/* WRONG: z-index too low, hidden behind sticky headers */
.tooltip { z-index: 10; }
/* Sticky nav at z-index 100 will cover it */
```

### Overflow parent trap

The most common reason popups are clipped is that a parent element has `overflow: hidden` or `overflow: clip`. The popup cannot visually escape its scroll parent.

Required rules:

- Floating elements (popovers, tooltips, dropdowns, date pickers) must be rendered outside their scroll parent using a portal pattern: mount them into `document.body` or a dedicated portal root, not inside the triggering card or container.
- The agent must never apply `overflow: hidden` to a container that has interactive children that need to visually overflow it, without first verifying no floating elements are children of that container.
- In React, use `createPortal` for all floating elements. In Vue, use `Teleport`. In plain HTML, append floating elements directly to `document.body`.

### Z-index stack for floating elements

Floating elements must use tokens from the shared z-index scale. They must never use arbitrary magic numbers.

Required z-index token scale (minimum):

```css
:root {
  --z-base:      0;
  --z-raised:    10;      /* cards, elevated content */
  --z-sticky:    100;     /* sticky headers, fixed sidebars */
  --z-dropdown:  200;     /* dropdowns, popovers */
  --z-tooltip:   300;     /* tooltips */
  --z-modal:     400;     /* modals, drawers */
  --z-toast:     500;     /* toast notifications */
  --z-top:       9999;    /* critical overlays, blocking loaders */
}
```

Any popup that appears below a sticky header because of z-index collision is a Gate 23 failure.

### Required DESIGN.md entry for floating elements

For each floating UI element (dropdown, popover, tooltip, date picker, combobox, context menu), the `DESIGN.md` Component Contract must include:

- Positioning strategy: A, B, or C
- Default direction
- Flip behavior and fallback directions
- Minimum clearance from viewport edges (px)
- Max height and overflow behavior
- Portal mounting point (body, portal root, or none if CSS-only)
- Z-index token used
- What happens on small-height viewports

### Gate 23 QA checklist

Implementation is blocked until every floating element passes:

- Dropdown opens above the trigger when not enough space below, and below when not enough space above.
- Dropdown does not extend past any viewport edge at any tested viewport size.
- Dropdown is not clipped by a parent with `overflow: hidden`.
- Dropdown z-index places it above sticky headers and sidebars.
- Tooltip does not overflow at viewport corners.
- Date picker caps its height at available space and scrolls internally.
- All floating elements use z-index tokens, not magic numbers.
- All floating elements are mounted outside their scroll parent (portal pattern) or are CSS-only with a known height constraint.

## Output behavior

When the user asks for a packaged skill, create the full folder structure.

When the user asks for a prompt, output a prompt that tells the coding agent to use this skill first.

When the user asks to build, produce or update `PRODUCT.md` and `DESIGN.md` first, then provide implementation instructions.

When the user asks for audit, read the existing UI and compare it against `DESIGN.md`, Impeccable rules, and the anti-slop list.

When the user asks to amplify an old design file, run Amplify Mode. Do not merely comment on the old file. Create a repaired, stronger version that passes this skill's validation and scoring gates.

## Required final response format

For a normal design preflight task, respond with:

1. Mode classification
2. Assumptions
3. `PRODUCT.md`
4. `DESIGN.md`
5. Coding-agent guardrails
6. Impeccable commands
7. QA checklist

For repository work, write the files directly when tools allow it.

For Amplify Mode, write `DESIGN.amplification-report.md` and `DESIGN.amplified.md` when tools allow it. If the user explicitly wants replacement, overwrite `DESIGN.md` only after preserving the old version as `DESIGN.legacy.md`.

## Quality gate

Before final output, run this mental check:

- Would this design file prevent generic AI frontend?
- Does the Creative North Star actually shape the components?
- Are typography, color, elevation, motion, copy, and layout all tied to product context?
- Could a coding agent implement without inventing a new visual system?
- Does it handle RTL correctly if the product language is Arabic or another RTL language? If the product is LTR-only, does it avoid unnecessary RTL rules?
- Does it include forbidden patterns?
- Does it explicitly ban weak contrast, generic AI gradients, sparkle icons, emoji icons, misaligned RTL or LTR, unmanaged stacking, weak mobile behavior, outdated popup patterns, and native browser dialogs?
- Does it declare viewport ownership per route and ban false no-scroll fixes?
- Does every modal use the backdrop grid centering pattern with `align-self: safe center`, not the `transform: translate(-50%, -50%)` pattern?
- Does every floating element (dropdown, popover, tooltip, date picker) declare a positioning strategy with flip behavior, viewport clearance, portal mounting, and z-index token?
- Are all floating elements mounted outside their scroll parent to prevent overflow clipping?
- Are all overlays (toast, tour, popover) centralized with collision handling, not built ad-hoc in pages?
- Does the dashboard shell declare grid layout with explicit scroll ownership per region?
- Are sensitive tokens masked by default with secure creation flow?
- Does the output avoid vague design adjectives?

If any answer is weak, revise before finalizing.
