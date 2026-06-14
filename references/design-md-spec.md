# DESIGN.md Specification

## Top-level structure

`DESIGN.md` must contain exactly these top-level H2 sections:

1. Overview
2. Colors
3. Typography
4. Elevation
5. Components
6. Do's and Don'ts

## Overview must include

- Creative North Star
- Design System Baseline with selected baseline, fit rationale, borrowed patterns, and non-copy rules
- Visual thesis
- Interface density
- Layout model
- Reading path
- Spacing rhythm
- Motion philosophy
- Intake Session Gate
- 2026 Standards Gate
- Rules Engine Gate
- Accessibility baseline
- Unslop setup gate with `npx unslop skills install`
- Localization and RTL notes when relevant

## Colors must include

- Background roles
- Surface roles
- Text roles
- Border roles
- Accent roles
- State roles: success, warning, error, info
- Chart palette when needed
- Usage rules
- Contrast warnings

## Typography must include

- Font stack
- Arabic font when relevant
- English companion font when relevant
- Heading scale
- Body scale
- Label scale
- Numeric scale
- Line height
- Letter spacing
- Maximum line width
- RTL and mixed-language rules

## Elevation must include

- Border logic
- Shadow logic
- Layering rules
- Overlay rules
- Focus rings
- Hover and active state behavior
- What should never receive elevation

## Components must include

Define each component with purpose, anatomy, variants, states, spacing, radius, border, background, typography, motion, accessibility, and forbidden mistakes.

## Do's and Don'ts must include

- Positive rules
- Forbidden visual patterns
- Copy rules
- Implementation guardrails
- QA checklist


## Required gate references

Every generated or amplified `DESIGN.md` must mention:

- Selected Design System Baseline
- `INTAKE.session.md`
- `STANDARDS.search-notes.md`
- `npx unslop skills install`
- `node scripts/validate-design-md.mjs DESIGN.md`
- `node scripts/score-design-md.mjs DESIGN.md PRODUCT.md`
- `node scripts/run-gates.mjs DESIGN.md PRODUCT.md src`

These are not decorative notes. They are implementation blockers.
