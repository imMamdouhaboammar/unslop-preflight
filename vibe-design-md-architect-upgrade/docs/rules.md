# Quality Gates & Rules

Vibe Design MD Architect runs a suite of quality gates against your `PRODUCT.md`, `DESIGN.md`, and `AGENT.md` files. These rules are categorized into 10 key areas.

## 1. Implementation Readiness
- **Rule**: `product.md-missing`, `design.md-missing`, `agent.md-missing`
- **Description**: Ensures the foundational documents exist before any coding begins.

## 2. Product Clarity
- **Rule**: `missing-target-users`, `missing-acceptance-criteria`
- **Description**: Ensures `PRODUCT.md` clearly defines who the product is for and how to measure success.

## 3. Risk Control
- **Rule**: `missing-non-goals`, `overflow-hidden-risk`
- **Description**: Limits scope creep via non-goals, and flags risky CSS practices like `overflow: hidden` which might mask layout bugs.

## 4. Responsive Design
- **Rule**: `missing-mobile-behavior`, `missing-tablet-behavior`, `height-100vh-mobile-risk`, `missing-responsive-warning`
- **Description**: Guarantees mobile and tablet layouts are explicitly defined and prevents common mobile layout bugs like raw `100vh`.

## 5. UX Completeness
- **Rule**: `missing-loading-empty-error`, `missing-form-validation`
- **Description**: Ensures interaction states (loading, empty, error) and form behaviors are fully spec'd.

## 6. Accessibility
- **Rule**: `missing-keyboard-navigation`, `missing-focus-management`, `modal-without-focus-trap`, `missing-color-contrast`
- **Description**: Enforces standard accessibility requirements, specifically around keyboard usability, focus management, and color contrast.

## 7. Security and Privacy
- **Rule**: `api-key-masking`, `auth-state-handling`
- **Description**: Prevents sensitive keys/tokens from being leaked in the UI and ensures auth states are securely handled.

## 8. Regression Protection
- **Rule**: `missing-do-not-break`
- **Description**: Injects guidelines into `AGENT.md` to prevent AI from accidentally deleting or breaking existing functionality.

## 9. Agent Handoff Readiness
- **Rule**: `missing-verification-checklist`, `missing-agent-handoff`
- **Description**: Ensures `AGENT.md` provides a structured, step-by-step checklist for the agent to follow before finalizing a task.

## 10. Content Quality
- **Rule**: `vague-modern`
- **Description**: Flags vague design instructions like "make it modern" or "beautiful UI" and encourages developers to use precise requirements instead.
