# Amplify Workflow

Amplify Mode repairs an existing design.md instead of starting from a blank template.

## Trigger phrases

Use Amplify Mode when the user says or implies:

- old design.md
- uploaded design.md
- improve this design system
- strengthen this design.md
- make it follow the rules
- amplify
- repair design rules
- remove AI-looking UI from this design file
- convert this weak UI guide into a real DESIGN.md

## Required inputs

Preferred inputs:

- Existing `design.md` or `DESIGN.md`
- `PRODUCT.md` if available
- Product idea or repository context
- Screenshots or existing UI if available

If `PRODUCT.md` is missing, infer product context from the old design file and mark assumptions.

## Mandatory pre-amplification gates

Before rewriting the old file:

1. Complete `INTAKE.session.md`.
2. Create or refresh `STANDARDS.search-notes.md`.
3. Attempt `npx impeccable skills install` when shell access exists.
4. Read the old design file completely.
5. Preserve the old file as `DESIGN.legacy.md` if it exists in the repository.

## Amplification principles

1. Preserve what is specific.
2. Delete what is generic.
3. Convert loose opinions into enforceable rules.
4. Convert raw colors into semantic tokens.
5. Convert vague components into implementation contracts.
6. Add responsive, directionality, accessibility, feedback, and motion rules.
7. Add the Impeccable setup gate with `npx impeccable skills install`.
8. Keep exactly the six top-level `DESIGN.md` sections.

## Diagnostic checklist

Audit the old file for:

- Missing intake session gate
- Missing 2026 standards search gate
- Missing rules engine gate
- Missing Impeccable setup gate
- Missing Creative North Star
- Weak visual thesis
- Vague adjectives
- Generic AI color palette
- Missing contrast requirements
- Missing typography scale
- Missing RTL or LTR directionality rules
- Missing responsive behavior
- Missing mobile interaction rules
- Missing component states
- Missing accessibility details
- Missing in-app popup system
- Native popup usage
- Emojis used as icons
- Sparkle or magic icons used as product language
- Undefined elevation and border logic
- Decorative motion
- No implementation guardrails

## Amplification report structure

Create `DESIGN.amplification-report.md` with:

```md
# DESIGN.md Amplification Report

## Summary

## What was preserved

## Critical issues found

## AI-looking patterns removed

## Accessibility fixes

## Directionality and localization fixes

## Responsive and mobile fixes

## Component system fixes

## Intake gate status

## Standards search gate status

## Rules engine status

## Impeccable setup status

## Remaining assumptions

## Validation checklist
```

## Output file rules

- If the original file is in the repo, preserve it as `DESIGN.legacy.md` before overwriting.
- If the original was uploaded by the user, do not mutate it. Produce `DESIGN.amplified.md`.
- If the user asks for direct replacement, produce both `DESIGN.legacy.md` and the new `DESIGN.md`.

## Pass bar

A good amplified file must score at least 90/100 using `scripts/score-design-md.mjs`. It must also pass `scripts/run-gates.mjs`.

If it scores below 90 or fails a blocker gate, revise before implementation.
