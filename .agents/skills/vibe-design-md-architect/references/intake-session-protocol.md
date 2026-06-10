# Intake Session Protocol

## Purpose

The intake session is the first gate before any design, amplify, audit, or implementation work. It forces Claude to extract context before producing UI decisions.

The first intake question must be the Design System Baseline question unless the user already answered it in the prompt or supplied files. After that, the agent must not ask broad aesthetic questions. It must understand product, user, task, risk, language direction, and conversion logic before discussing color or visual mood.

## Intake order

1. Read the user prompt.
2. Read any uploaded or existing `PRODUCT.md`, `DESIGN.md`, screenshots, repository files, README, package files, brand files, and UI code.
3. Infer all context that is safely inferable.
4. Record the Design System Baseline as the first intake decision. If it is missing, ask the mandatory first question before any other question.
5. Write `INTAKE.session.md`.
6. Ask only missing high-impact questions, with a maximum of 7 questions including the baseline question.
7. If the user does not answer or asks to proceed, continue with `custom-hybrid` or the safest inferred baseline with documented assumptions.
8. Use the intake output as input for `PRODUCT.md` and `DESIGN.md`.

## Mandatory first question

Ask this first if not already answered:

Which design system baseline should guide this project?

1. Atlassian Design System
2. Lightning Design System (Salesforce)
3. Polaris (Shopify)
4. Material Design
5. Human Interface Guidelines (Apple)
6. Custom / hybrid, with a short explanation

Record the answer as one of:

- `atlassian`
- `salesforce-lightning`
- `shopify-polaris`
- `material-design`
- `apple-human-interface`
- `custom-hybrid`

If the selected system conflicts with the product, state the conflict and suggest a better baseline, but do not override the user without saying so.

## Required intake fields

- Design system baseline
- Baseline fit rationale
- Product name
- Product category
- Core user
- User situation
- Main job to be done
- User pain
- Desired action
- Conversion or task success event
- Brand register
- Emotional register
- Visual anti-references
- Language and localization
- RTL/LTR behavior
- Accessibility needs
- Trust and risk level
- Data density
- Mobile priority
- Product surface type
- Required components
- Existing constraints
- Stack and implementation environment
- Content availability
- Assumptions
- Questions, if any

## Question policy

Ask questions only when the missing answer changes a design decision.

Bad questions:

- What colors do you like?
- Should it be modern?
- Do you want it clean?
- Any preferences?

Good questions:

- Is the first screen meant to sell, onboard, monitor, or help the user finish a task?
- Is Arabic the primary language or a secondary locale?
- Is the user a buyer, operator, admin, creator, or developer?
- Is the interface low-risk content browsing or high-risk data/action confirmation?
- Which action must be most obvious in the first 5 seconds?

## Intake output rule

The intake artifact must separate:

- Inferred facts
- User-provided facts
- Assumptions
- Open questions
- Decisions that depend on answers

Implementation is blocked until intake is recorded and the design system baseline is selected or safely assumed.
