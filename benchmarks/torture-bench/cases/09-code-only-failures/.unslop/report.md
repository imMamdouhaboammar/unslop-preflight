# Unslop Autopilot Report

## 1. Executive Summary
**Score:** 0/100
**Readiness:** blocked
> **Decision:** Do not hand this to an AI coding agent yet. Resolve errors and blocked source issues first.

**Totals:** 25 Blockers | 5 Warnings | 3 Info

## 2. Top Blockers

- **[`unresolved-product-placeholders`]** at `PRODUCT.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`missing-design-read`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`missing-taste-dials`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`missing-design-system-decision`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`missing-preflight-proof`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict

## 3. Evidence Table

| Severity | Rule | Location | Symptom / Excerpt | Confidence |
|----------|------|----------|-------------------|------------|
| ERROR | `unresolved-product-placeholders` | `PRODUCT.md` |  | high |
| ERROR | `missing-design-read` | `DESIGN.md` |  | high |
| ERROR | `missing-taste-dials` | `DESIGN.md` |  | high |
| ERROR | `missing-design-system-decision` | `DESIGN.md` |  | high |
| ERROR | `missing-preflight-proof` | `DESIGN.md` |  | high |
| ERROR | `typography-hierarchy-missing` | `DESIGN.md` |  | high |
| ERROR | `typography-line-height-missing` | `DESIGN.md` |  | high |
| ERROR | `root-cause-mode-missing` | `AGENTS.md` |  | high |
| ERROR | `install-agent-harness-missing` | `AGENTS.md` |  | high |
| ERROR | `react-harness-recommendation-missing` | `AGENTS.md` |  | high |
| ERROR | `modal-viewport-contract-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-width-guard-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-height-guard-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-internal-scroll-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-viewport-qa-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-fixed-size-risk` | `DESIGN.md` |  | high |
| ERROR | `stacking-plan-missing` | `DESIGN.md` |  | high |
| ERROR | `stacking-context-audit-missing` | `DESIGN.md` |  | high |
| ERROR | `layer-scale-missing` | `DESIGN.md` |  | high |
| ERROR | `overlay-portal-policy-missing` | `DESIGN.md` |  | high |
| ERROR | `layer-conflict-matrix-missing` | `DESIGN.md` |  | high |
| ERROR | `deterministic-focus-management` | `DESIGN.md` |  | high |
| ERROR | `blind 100vh full-page height (V2)` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:4` | <div className="h-screen w-[900px] overflow-y-scroll"> | high |
| ERROR | `Tailwind h-screen used without dvh/min-h fallback (V4)` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:4` | <div className="h-screen w-[900px] overflow-y-scroll"> | high |
| WARNING | `overlay-missing-portal` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:3` | <div className="fixed inset-0 z-[9999]"> | high |
| WARNING | `arbitrary-z-index-slop` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:3` | <div className="fixed inset-0 z-[9999]"> | high |
| ERROR | `fixed-width-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:4` | <div className="h-screen w-[900px] overflow-y-scroll"> | high |
| WARNING | `height-100vh-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:4` | <div className="h-screen w-[900px] overflow-y-scroll"> | high |
| WARNING | `oversized-typography-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:5` | <h1 className="text-[88px] leading-none">Pay now</h1> | high |
| WARNING | `leading-none-cutoff-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/benchmarks/torture-bench/cases/09-code-only-failures/src/components/PaymentDialog.jsx:5` | <h1 className="text-[88px] leading-none">Pay now</h1> | high |
| INFO | `missing-skill-frontend-ui-engineering` | `N/A` | Complex UI framework detected without explicit UI engineering guards. | high |
| INFO | `missing-skill-chrome-devtools` | `N/A` | Web project detected. Agent lacks live browser validation. | high |
| INFO | `missing-skill-a11y-debugging` | `N/A` | High risk of inaccessible modals, missing ARIA tags, and bad contrast. | high |

## 4. Auto Repairs Applied

- **PRODUCT.md**: appended safe section (`missing-target-users`)
- **PRODUCT.md**: appended safe section (`missing-acceptance-criteria`)
- **PRODUCT.md**: appended safe section (`missing-non-goals`)
- **DESIGN.md**: appended safe section (`deterministic-mobile-behavior`)
- **DESIGN.md**: appended safe section (`missing-keyboard-navigation`)
- **DESIGN.md**: appended safe section (`modal-without-focus-trap`)
- **DESIGN.md**: appended safe section (`deterministic-contrast-math`)
- **AGENTS.md**: appended safe section (`missing-do-not-break`)
- **AGENTS.md**: appended safe section (`missing-verification-checklist`)
- **DESIGN.md**: appended safe section (`missing-agent-handoff`)

## 5. Agent Handoff Prompt

> Inspect PRODUCT.md, DESIGN.md, AGENTS.md, package.json, routing files, component structure, and existing tests. Read `.unslop/fix-list.md` and resolve any listed issues. Implement only the requested scope while preserving existing behavior. Before completion, run `npx unslop audit`, ensure there are 0 errors, and show the final output score and readiness.

## 6. Verification Checklist
- [ ] Build succeeds without errors
- [ ] Mobile viewports (320px, 375px, 390px) checked
- [ ] Keyboard navigation and focus traps work
- [ ] RTL layout checked (if applicable)
- [ ] Overlays and modals render correctly without scroll cutoff