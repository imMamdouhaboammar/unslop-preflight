# 2026 Standards Search Engine

## Purpose

This is the current-standards gate. It makes Claude verify interface standards before creating or amplifying `DESIGN.md`.

The agent must use current web access when available. Prefer official sources. Do not treat old memory as enough for standards, browser support, framework APIs, or accessibility details.

## Required source classes

Use these source classes in this order:

1. Official standards and specification bodies, such as W3C and WHATWG.
2. Official platform documentation, such as MDN and web.dev.
3. Official framework documentation for the project stack.
4. Official tool documentation for Claude Skills and Impeccable.
5. Reputable engineering articles only for examples and interpretation.
6. Community discussions only as qualitative signals, never as standards.

## Mandatory search topics

Every standards search must verify:

- Claude Skills packaging and custom skill folder anatomy.
- Impeccable install command and workflow.
- WCAG 2.2 AA rules relevant to contrast, focus, keyboard, reflow, target size, labels, errors, reduced motion, and non-text contrast.
- W3C directionality guidance for RTL languages, especially Arabic.
- MDN Baseline status for newer web platform features.
- web.dev responsive design guidance, container queries, and Core Web Vitals.
- HTML dialog and modal guidance.
- Framework-specific current docs when the stack is known.

## Search output

Create or update `STANDARDS.search-notes.md` with:

- Date checked
- Topics searched
- Sources used
- Standards adopted
- Standards rejected or deferred
- Browser support notes
- Framework notes
- Risk notes
- Impact on `DESIGN.md`

## Adoption rule

Only adopt a feature or pattern when it is:

- Supported by current official documentation
- Accessible or can be made accessible
- Compatible with the target stack
- Appropriate for the user task
- Not added only because it is trendy

## If web access is unavailable

Use bundled references and mark the gate as `pass-with-stale-risk`. The final `DESIGN.md` must state that live standards search was not refreshed.


## Design system baseline search

The standards search must include official documentation for the selected Design System Baseline.

Required source targets:

- Atlassian Design System: foundations, components, tokens, typography, spacing, accessibility, and interaction guidance.
- Lightning Design System (Salesforce): component blueprints, design tokens, styling hooks, accessibility, and enterprise workflow patterns.
- Polaris (Shopify): foundations, tokens, web components, admin patterns, merchant language, resource lists, and settings patterns.
- Material Design: Material Design 3 components, theming, motion, accessibility, and layout guidance.
- Human Interface Guidelines (Apple): platform foundations, navigation, controls, feedback, modality, touch targets, and platform conventions.

The search result must be summarized in `STANDARDS.search-notes.md` and reflected in `DESIGN.md` under `Overview > Design System Baseline`.

The baseline must guide component behavior and interaction logic. It must not copy another company’s brand colors, proprietary visual identity, product metaphors, or marketing tone unless explicitly licensed and requested.
