# Gates Protocol

## Gate order

1. Mode Classification Gate
2. Intake Session Gate
3. Standards Search Gate
4. Impeccable Setup Gate
5. PRODUCT.md Gate
6. DESIGN.md Contract Gate
7. Rules Engine Gate
8. Implementation Scan Gate
9. Final Handoff Gate

## Mode Classification Gate

Classify the request before doing work. Valid modes are fresh-seed, existing-scan, redesign, implementation, audit, and amplify.

## Intake Session Gate

Create or update `INTAKE.session.md`. Extract inferable context first. Ask at most 7 high-impact questions only when needed.

## Standards Search Gate

Create or update `STANDARDS.search-notes.md`. Use live official sources when web access exists. Mark bundled-references-only when unavailable.

## Impeccable Setup Gate

Attempt:

```bash
npx impeccable skills install
```

Document failure if unavailable.

## PRODUCT.md Gate

Create strategy context with user, job, promise, risks, anti-references, accessibility, localization, and success criteria.

## DESIGN.md Contract Gate

Create exactly six top-level sections:

1. Overview
2. Colors
3. Typography
4. Elevation
5. Components
6. Do's and Don'ts

## Rules Engine Gate

Run:

```bash
node scripts/run-gates.mjs DESIGN.md PRODUCT.md src
```

Fix blockers before implementation.

## Implementation Scan Gate

Run source scanners before final handoff.

```bash
node scripts/scan-ui-implementation.mjs src
npx impeccable detect src/
```
