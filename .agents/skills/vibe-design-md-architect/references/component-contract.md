# Component Contract Reference

## Purpose

Use this file when writing the Components section of `DESIGN.md`.

Each component must be designed as a decision tool, not as decoration.

## Required component format

For every component, define:

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

## Minimum components

### Button

Define primary, secondary, ghost, destructive, disabled, loading, icon-only, and full-width variants.

### Input

Define label, field, helper text, error text, icon slot, character count, focus, invalid, disabled, and filled states.

### Card

Define when cards are allowed. Do not wrap everything in cards.

### Navigation

Define desktop and mobile behavior, active states, collapsed states, and focus states.

### Data table or list

Define density, row height, sorting, filtering, empty state, loading skeleton, selected state, and responsive behavior.

### Modal or drawer

Define when to use each, overlay behavior, close behavior, focus trap, and mobile fallback.

### Toast or alert

Define success, warning, error, and info states. Alerts must tell the user what happened and what to do.

### Empty state

Define empty state copy, illustration rules, primary action, secondary action, and forbidden decorative filler.

### Loading state

Define skeleton, spinner, progress, and when each is allowed.

## SaaS components

### KPI card

Must include metric, label, comparison, confidence or source when relevant, and interpretation.

### Filter bar

Must show current scope and make reset visible.

### Command menu

Must include keyboard states and empty search state.

### Billing card

Must separate price, limit, renewal, and action.

### Chart container

Must define title, subtitle, legend, tooltip, empty state, error state, and data source note.
