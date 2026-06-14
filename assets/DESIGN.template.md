# DESIGN.md

## Overview

### Creative North Star

[Specific metaphor or product scene]

### Visual thesis

[One paragraph explaining why the UI should look and behave this way]

### Design System Baseline

- Selected baseline: `[atlassian | salesforce-lightning | shopify-polaris | material-design | apple-human-interface | custom-hybrid]`
- First intake question status: `[answered | inferred | assumed after no answer]`
- Why this baseline fits: [product-specific rationale]
- What to borrow: [interaction logic, density, component semantics, patterns]
- What not to copy: [brand colors, proprietary look, irrelevant patterns]
- Adaptation notes: [how the baseline is adapted to language, platform, brand, accessibility, and product risk]
- Official documentation checked in Standards Gate: [yes/no/source notes]


### Interface density

[Calm, standard, compact, operator-grade, editorial, immersive]

### Layout model

[Page shell, container widths, grid, mobile behavior, viewport behavior, container-aware component behavior]

### Page Viewport Contract

Every page must declare one of these viewport modes before implementation: `single-screen-fit`, `document-scroll`, `panel-scroll`, or `data-overflow-exception`.

| Route | Viewport mode | Scroll owner | No-scroll requirement | Overflow exceptions |
|---|---|---|---|---|
| `/login` | single-screen-fit | safety document scroll only | no visible scroll at normal content size | none |
| `/signup` | single-screen-fit | safety document scroll only | no visible scroll at normal content size | none |
| `/forgot-password` | single-screen-fit | safety document scroll only | no visible scroll at normal content size | none |
| `/reset-password` | single-screen-fit | safety document scroll only | no visible scroll at normal content size | none |
| `/otp` | single-screen-fit | safety document scroll only | no visible scroll at normal content size | none |
| `/dashboard` | panel-scroll | main content panel | document stable | tables only |
| `/settings` | document-scroll | document | scroll expected | none |
| `/[landing]` | document-scroll | document | scroll expected | none |

Add or modify rows to match the actual routes in the project.

### Auth Action Hierarchy

Auth pages must follow a strict visual hierarchy. One dominant CTA per auth card.

| Priority | Element | Visual weight |
|---|---|---|
| 1 | Primary method (email/password or magic link) | Dominant |
| 2 | Primary CTA (submit button) | Dominant |
| 3 | Recovery link (forgot password) | Subtle link |
| 4 | Social login group | Secondary, visually quieter |
| 5 | Account switch link (create / already have account) | Tertiary link |
| 6 | Legal copy (terms, privacy) | Compact footer, 1-2 lines |

Decorative separators must not look like buttons. Legal copy must not create scroll pressure.

### Dashboard Shell Contract

Dashboard pages must use a declared grid layout.

| Region | Sizing | Scroll owner |
|---|---|---|
| Sidebar | `minmax(240px, 280px)` bounded | sidebar scrolls internally |
| Main content | `minmax(0, 1fr)` flexible | main scrolls internally |
| Data tables | Full available width | table container scrolls horizontally when needed |
| Document body | No scroll | Locked by shell grid |

Main content must calculate available width after sidebar. Content must never slide under the sidebar. Floating widgets must never cover primary actions or tables.

### Overlay Stack Contract

All overlays must come from a centralized Overlay System. No ad-hoc `position: fixed` overlays in page components.

| Overlay type | z-index token | Coexistence |
|---|---|---|
| Sticky elements | `--z-sticky: 100` | Always visible |
| Dropdown | `--z-dropdown: 300` | Closes others on open |
| Popover | `--z-popover: 400` | One at a time |
| Toast | `--z-toast: 700` | Queue-based, collision-aware |
| Guided tour | `--z-tour: 800` | Moves toast if collision |
| Modal backdrop | `--z-modal-backdrop: 900` | Blocks all below |
| Modal | `--z-modal: 1000` | Blocks all below |

Toast must use safe area placement calculated from layout zones. Toast is triggered through `toast.success()` etc., rendered only through `ToastViewport`.

### Sensitive Data Display Rules

| Data type | Default display | Copy | Reveal | Creation flow |
|---|---|---|---|---|
| API key / token | Masked: `sk_live_••••3a7f` | Copy button with feedback | Optional, temporary (10-30s) | Secure result modal, shown once |
| Secret / webhook | Masked: `whsec_••••a2b1` | Copy button with feedback | Optional, temporary | Secure result modal, shown once |
| Password | Never displayed | N/A | N/A | N/A |

Delete, revoke, and rotate actions require destructive-action confirmation modal.

### Reading path

[How the user scans the interface]

### Spacing rhythm

[Spacing scale and when to use each level]

### Motion philosophy

[Allowed and forbidden motion, reduced-motion behavior, no decorative pulsing, no bounce, no layout-shift animation]

### Intake Session Gate

Before this `DESIGN.md` was created or expanded, the agent must complete an intake session and record what was inferred, what was missing, and what assumptions were used. Implementation is blocked until intake is complete.

- Intake artifact: `INTAKE.session.md`
- Maximum intake questions: 7
- Do not ask questions already answerable from the prompt, repository, screenshots, or old design file.

### 2026 Standards Gate

Before implementation, the agent must search or verify current official standards when web access exists. Record the search date, topics checked, and adopted rules.

Required topics:

- Claude Skills packaging
- Unslop setup
- WCAG 2.2 AA
- W3C RTL and internationalization
- MDN Baseline and dialog guidance
- web.dev responsive design, container queries, and Core Web Vitals
- Framework docs for the current stack

If web access is unavailable, document that the standards gate used bundled references only.

### Rules Engine Gate

Before any code is written, `DESIGN.md` must pass:

```bash
node scripts/validate-design-md.mjs DESIGN.md
node scripts/score-design-md.mjs DESIGN.md PRODUCT.md
node scripts/run-gates.mjs DESIGN.md PRODUCT.md src
```

Implementation is blocked until failed gates are repaired.

### Accessibility baseline

[Contrast, focus, keyboard, target size, reduced motion, text size, labels, error recovery]

### Unslop setup gate

Before implementation, the coding agent must run this command from the project root when shell access exists:

```bash
npx unslop skills install
```

If the command has already been run, the agent must confirm it. If it cannot run, the agent must document the failure reason and continue using this `DESIGN.md` as the source of truth. UI implementation must not start before this setup gate is attempted.

### Non-negotiable interface rules

- Contrast: [specific minimums for text, icons, borders, focus, charts, and states]
- AI color control: [rules that prevent generic purple/blue/neon/aurora gradient defaults]
- Icon system: [rules banning sparkle icons, magic icons, generic AI icons, and emoji-as-icon usage]
- Directionality: [fully RTL for Arabic, fully LTR for English, mixed-language behavior]
- UX-CRX logic: [primary action, secondary action, decision point, recovery path, conversion logic]
- Mobile: [first-class responsive behavior across viewports]
- Popup system: [in-app modal, drawer, toast, banner, inline validation rules, no native browser popups]
- Modal governance: every modal must have a contract covering scroll ownership, focus trapping, inert background, backdrop salience, viewport sizing, and RTL behavior. A centered card without these contracts is not a valid modal.
- Overlay system: all overlays (toast, tour, popover, dropdown) must come from a centralized system with z-index tokens, safe area collision handling, and queue management. No ad-hoc fixed overlays in page components.
- Dashboard shell: sidebar and main content must use declared grid layout with explicit scroll ownership per region. Content must not slide under sidebar.
- Sensitive data: tokens and secrets masked by default, secure creation flow via modal, destructive actions require confirmation.
- Viewport ownership: every page declares whether scroll belongs to the document, a panel, a modal, or no component in normal state.
- No false no-scroll fixes: never apply blanket `overflow: hidden` to hide layout overflow.
- Auth pages: must fit normal viewport without visible scroll, while keeping safe overflow recovery for keyboard, zoom, long errors, and localization.
- Horizontal overflow: forbidden on the document. Allowed only inside documented data components.
- Full-screen pages use `min-block-size: 100dvh` with `100vh` fallback, not fixed `height: 100vh`.
- Height-responsive behavior tested at 568, 640, 720, 800, and 900px heights.

### Localization and RTL

[RTL, LTR, Arabic, mixed-language, number rules, icon mirroring, table direction, form direction]

## Colors

### Palette

- Background: `#000000`
- Surface: `#000000`
- Surface raised: `#000000`
- Text primary: `#000000`
- Text secondary: `#000000`
- Border subtle: `#000000`
- Border strong: `#000000`
- Accent: `#000000`
- Accent soft: `#000000`
- Success: `#000000`
- Warning: `#000000`
- Error: `#000000`
- Info: `#000000`

### Usage rules

[Rules]

### AI color control

- Do not use purple to blue gradients as default identity.
- Do not use neon or aurora gradients unless explicitly justified by product context.
- Do not use gradient text unless contrast is verified and the brand context requires it.
- Accent colors guide attention only. They must not flood the interface.
- Every color must map to a semantic role.


### Contrast rules

- Normal text: [minimum ratio]
- Large text: [minimum ratio]
- Icons and controls: [minimum ratio]
- Focus rings: [visibility rule]
- Charts and data marks: [contrast and labeling rule]
- Text over images, gradients, glass, or blur: [allowed only with verified contrast]


### Chart colors

[Rules]

## Typography

### Fonts

- Arabic: `[font]`
- English: `[font]`
- Numeric: `[font or tabular setting]`

### Scale

- Display: `[size/line-height/weight]`
- H1: `[size/line-height/weight]`
- H2: `[size/line-height/weight]`
- H3: `[size/line-height/weight]`
- Body: `[size/line-height/weight]`
- Small: `[size/line-height/weight]`
- Label: `[size/line-height/weight]`
- Caption: `[size/line-height/weight]`

### Rules

[Line length, letter spacing, mixed-language, labels, error text]

### Directionality and alignment

- Arabic: [document direction, shell direction, nav order, form alignment, table behavior]
- English: [document direction, shell direction, nav order, form alignment, table behavior]
- Mixed content: [numbers, currencies, URLs, emails, code, abbreviations]
- Use `text-align: start` and logical spacing unless an exception is documented.


## Elevation

### Layer model

[Base, raised, overlay, modal]

### Borders

[Border usage]

### Shadows

[Shadow usage]

### Focus rings

[Focus behavior, focus visibility, focus not obscured by sticky UI, keyboard navigation behavior]

### Interaction states

[Hover, active, disabled, loading]

## Components

### Button

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Input

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Select

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Card

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Navigation

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Sidebar

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Modal or drawer

- Purpose:
- Modal type: [confirmation | form modal | destructive action | wizard step | detail viewer | command palette | alert]
- Scroll owner: [dialog body | internal panel | no scroll in normal state]
- Background behavior: [inert, no interaction, no scroll while open]
- Focus behavior:
  - Initial focus target: [first focusable element | specific field]
  - Focus trap: [Tab/Shift+Tab stay inside dialog]
  - Escape behavior: [closes modal | requires explicit confirmation for destructive actions]
  - Focus restoration: [returns to trigger element after close]
- Accessible naming: [aria-labelledby pointing to title | aria-label]
- Anatomy:
- Variants:
- States: [open, closing, loading, error, success]
- Sizing:
  - Max width: `min(calc(100vw - 32px), [max-width])`
  - Max height: `calc(100dvh - 32px)`
  - Small-height fallback: [modal body scrolls, header/footer fixed]
  - Mobile keyboard fallback: [content remains reachable]
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion: [open animation, close animation, reduced-motion behavior]
- Backdrop:
  - Background: `var(--backdrop-bg, rgba(0, 0, 0, 0.48))`
  - Blur: `var(--backdrop-blur, 8px)`
  - Shadow: `var(--modal-shadow, 0 24px 80px rgba(0, 0, 0, 0.28))`
  - Salience rule: background CTAs must not compete with modal CTA
- Close button:
  - Hit area: 44x44px preferred, 24x24px minimum
  - Accessible label: required
- Scroll lock:
  - Body scroll paused while open
  - Scroll position preserved and restored on close
  - Scrollbar gutter handled to prevent layout shift
- RTL and mixed language:
  - English tokens inside Arabic modals isolated with `<bdi>` or directional spans
  - Select chevrons, icons, alignment follow RTL logic
- Copy rules: task-based, short, action verbs for title and CTA
- Accessibility:
- Do not:
  - Allow background scroll while modal is open
  - Allow focus to escape the modal
  - Use fixed widths that exceed mobile viewport
  - Use fixed heights without internal overflow planning
  - Use placeholder as the only label inside form modals
  - Use background elements that visually compete with the modal CTA

### Icon system

- Purpose:
- Allowed icon family:
- Stroke or fill logic:
- Sizes:
- Alignment:
- Functional icon labels:
- Decorative icon handling:
- Do not: Use emojis as icons, sparkle icons, magic wands, starbursts, glitter, generic AI brains, or robot icons unless explicitly justified.

### In-app popup system

- Purpose:
- Modal usage: [when to use, scroll lock, focus trap, backdrop rules, see Modal or drawer contract above]
- Drawer usage:
- Toast usage:
- Banner usage:
- Inline validation usage:
- Confirmation pattern:
- Destructive action pattern: [must require explicit confirmation, Escape must not dismiss]
- Scroll lock rule: modal scroll lock must preserve position, prevent layout shift, restore on close
- Backdrop salience rule: background CTAs must not compete with active overlay CTA
- Accessibility:
- Do not: Use `alert()`, `confirm()`, or `prompt()` for product flows. Use a centered card without focus trapping, scroll lock, and accessible naming.

### Toast or alert

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Data table or list

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Empty state

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Loading state

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

### Form validation

- Purpose:
- Anatomy:
- Variants:
- States:
- Spacing:
- Radius:
- Border:
- Background:
- Typography:
- Motion:
- Accessibility:
- Do not:

## Do's and Don'ts

### Do

- Run `npx unslop skills install` from the project root before UI implementation when shell access exists.
- Read `PRODUCT.md` and `DESIGN.md` before coding.
- Keep every visual decision traceable to this file.

### Don't

- Use weak contrast or low-opacity text without verified readability.
- Use generic AI gradients, neon blobs, aurora backgrounds, or gradient text as default identity.
- Use sparkle, magic wand, starburst, glitter, generic robot, or emoji icons as the UI icon system.
- Mix RTL text alignment with LTR layout structure, or the opposite.
- Stack cards and sections without UX-CRX logic.
- Treat mobile as desktop content stacked vertically.
- Use native browser `alert()`, `confirm()`, or `prompt()` for product interactions.
- Ignore semantic HTML, keyboard navigation, visible focus, reduced motion, or accessible labels.
- Skip the Unslop setup gate or remove the `npx unslop skills install` command from project instructions.
- Apply blanket `overflow: hidden` on `html`, `body`, `#root`, `main`, or page shells to hide layout overflow.
- Use `width: 100vw` on padded wrappers (creates horizontal overflow).
- Use fixed `height: 100vh` on content-heavy containers without a documented internal scroll owner.
- Freeze the viewport to mask scroll issues instead of fixing the layout cause.
- Build a modal as a centered card without focus trapping, scroll lock, backdrop salience control, and accessible naming.
- Allow background scroll or interaction while a modal is open.
- Use placeholder text as the only label inside form modals.
- Use close buttons smaller than 24x24px hit area without accessible labels.
- Build ad-hoc overlays (toast, tooltip, popover, tour) with `position: fixed` inside page components instead of using the centralized overlay system.
- Show full API keys, tokens, or secrets in tables or cards without masking.
- Use toast as the only feedback for sensitive actions like API key creation.
- Allow toast to cover tables, CTAs, guided tour panels, or primary actions.
- Place dashboard main content under the sidebar instead of calculating available width.

### Implementation guardrails

- Run `npx unslop skills install` from the project root before coding when shell access exists.
- Read `PRODUCT.md` and `DESIGN.md` before coding.
- Do not invent a new visual system.
- If a token or component rule is missing, update `DESIGN.md` before coding.
- Keep all UI decisions traceable to the Creative North Star.
- Run validation before final delivery.
