# Dashboard Shell and Auth Layout Rules Reference

## Purpose

This file defines the structural rules for dashboard shells, auth page action hierarchy, and page type contracts. The core problem: AI agents build layouts that look correct on one viewport but break when sidebars, overlays, tables, and floating elements interact.

## Extended Page Type Contract

Every route must declare its page type before implementation. This extends the viewport contract (Gate 18) with structural behavior.

Page types:

- `auth-single-screen`: login, signup, forgot password, reset password, OTP, invite accept, onboarding welcome.
- `dashboard-shell`: admin panels, analytics, settings dashboards, account management.
- `data-table-page`: API key management, user lists, order tables, log viewers.
- `form-page`: profile settings, billing forms, configuration forms.
- `wizard-page`: multi-step onboarding, checkout, guided setup.
- `modal-flow`: actions that happen inside modals (API key creation, deletion confirmation).
- `landing-page`: marketing pages, product pages, pricing pages.
- `settings-page`: account settings, preferences, integrations.

Every page must declare:

- Scroll owner
- Expected viewport behavior
- Overflow exceptions
- Fixed elements
- Floating elements
- Responsive height behavior
- RTL and mixed-language handling
- Overlay coexistence rules

Implementation is blocked if the page does not declare its contract.

## Auth Action Hierarchy

Auth screens must not overload the user with equal-weight actions.

Required order:

1. Primary method: email/password or magic link
2. Primary CTA
3. Recovery link (forgot password)
4. Social login group (visually secondary)
5. Account switch link (create account / already have account)
6. Legal copy (terms, privacy)

Rules:

- Social buttons must be visually quieter than the primary CTA.
- Decorative separators must not look like buttons or active elements.
- Skip buttons must not have the same visual weight as login actions.
- Legal copy must be compact and must not create scroll pressure.
- There must be only one dominant CTA in the auth card.

Recommended auth height budget:

- Brand header: maximum 15% of viewport height
- Auth card (form + CTA): 50-65% of viewport height
- Social login section: compact, below auth card
- Legal copy: compact footer, 1-2 lines maximum
- Total must fit within normal viewport without scroll

## Dashboard Shell Contract

Dashboard pages must use a declared shell layout with explicit ownership of each region.

Required:

- Sidebar column must have a fixed or bounded inline size.
- Main content must calculate available width after sidebar.
- Main content must not slide under the sidebar.
- Floating widgets must not cover primary actions, tables, forms, or navigation.
- Body scroll, main scroll, panel scroll, and table scroll must be declared separately.
- Horizontal document scroll is forbidden.
- Horizontal overflow is allowed only inside explicit data components (tables, code blocks).
- Tables must have internal overflow handling.
- Sticky headers and sticky action columns must be used where useful.

Recommended dashboard shell CSS:

```css
.app-shell {
  min-block-size: 100dvh;
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
  overflow: clip;
}

.app-sidebar {
  min-block-size: 100dvh;
  overflow-y: auto;
}

.app-main {
  min-inline-size: 0;
  min-block-size: 100dvh;
  overflow-y: auto;
  overflow-x: clip;
}

.table-region {
  min-inline-size: 0;
  overflow-x: auto;
}
```

For RTL layouts:

- Sidebar placement must be intentional.
- If the sidebar is on the right (logical start in RTL), the grid order and content padding must reflect that.
- Use logical properties: `padding-inline-start`, `margin-inline-end`.

## Dashboard Scroll Ownership

For `dashboard-shell` pages, scroll ownership must be explicit:

| Element | Scroll behavior | Owner |
|---|---|---|
| Document body | No scroll | Locked by shell grid |
| Sidebar | Internal vertical scroll | `.app-sidebar` |
| Main content | Internal vertical scroll | `.app-main` |
| Data tables | Internal horizontal scroll when needed | `.table-region` |
| Modals | Internal body scroll when content overflows | `.modal-body` |
| Page body | Never horizontal scroll | Forbidden |

## Data Table Layout Rules

Tables inside dashboards must handle overflow gracefully.

Required:

- Table container must allow internal horizontal scroll when columns exceed available width.
- Sensitive columns (tokens, secrets) must be masked by default.
- Action columns should be sticky when horizontal scroll is active.
- Column widths must be declared or use `min-width` constraints, not left to auto-distribute.
- The page must never get horizontal document scroll because of a wide table.

Forbidden:

- `width: 100vw` on table wrappers (causes horizontal overflow with scrollbar).
- Table rows that push the entire page wider.
- Token or secret columns showing full values.

## Form Field Quality Gate

Every form field must define:

- Visible persistent label
- Placeholder or example (optional, never a replacement for label)
- Helper text if needed
- Error message
- Disabled state
- Focus state
- Loading state where relevant
- Success state where relevant

Rules:

- Placeholder is never a replacement for a visible label.
- Placeholder text must not look disabled.
- Input text and placeholder contrast must be checked against WCAG AA (4.5:1 for normal text).
- Icons inside inputs must not reduce readability.
- Mixed Arabic and English values must use direction-safe behavior.
- Email, URL, token, and identifier inputs should use `dir="ltr"` or `dir="auto"` where appropriate.

## Visual Hierarchy Rules

The interface must define hierarchy before styling.

Required:

- One dominant action per section.
- Secondary actions must be visually quieter.
- Decorative separators must not look like actions.
- Floating elements must not compete with the page's primary task.
- Empty space must be intentional, not a result of broken layout.
- Cards must have consistent padding, radius, shadow, and border tokens.

## Technical references

- MDN: CSS overflow for scroll ownership
- MDN: viewport height media queries for auth height budget
- DEV Community: why 100vw causes horizontal scrollbar
- WCAG 2.2: Contrast Minimum (1.4.3) for form field contrast
- WCAG 2.2: Labels or Instructions (3.3.2) for form labels
