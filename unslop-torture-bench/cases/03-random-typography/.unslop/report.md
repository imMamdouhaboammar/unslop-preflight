# Unslop Autopilot Report

## 1. Executive Summary
**Score:** 0/100
**Readiness:** blocked
> **Decision:** Do not hand this to an AI coding agent yet. Resolve errors and blocked source issues first.

**Totals:** 15 Blockers | 5 Warnings | 3 Info

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
| ERROR | `typography-scale-missing` | `DESIGN.md` |  | high |
| ERROR | `typography-hierarchy-missing` | `DESIGN.md` |  | high |
| ERROR | `root-cause-mode-missing` | `AGENTS.md` |  | high |
| ERROR | `install-agent-harness-missing` | `AGENTS.md` |  | high |
| ERROR | `react-harness-recommendation-missing` | `AGENTS.md` |  | high |
| ERROR | `modal-viewport-contract-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-width-guard-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-height-guard-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-internal-scroll-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-viewport-qa-missing` | `DESIGN.md` |  | high |
| WARNING | `oversized-typography-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/unslop-torture-bench/cases/03-random-typography/src/components/Hero.jsx:4` | <h1 className="text-[92px] leading-none font-black">Launch faster with AI</h1> | high |
| WARNING | `leading-none-cutoff-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/unslop-torture-bench/cases/03-random-typography/src/components/Hero.jsx:4` | <h1 className="text-[92px] leading-none font-black">Launch faster with AI</h1> | high |
| WARNING | `oversized-typography-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/unslop-torture-bench/cases/03-random-typography/src/components/Hero.jsx:5` | <p className="text-[19px] leading-[21px]">A premium dashboard for your team.</p> | high |
| WARNING | `oversized-typography-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/unslop-torture-bench/cases/03-random-typography/src/components/Hero.jsx:6` | <button className="text-[17px]">Start now</button> | high |
| WARNING | `oversized-typography-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/unslop-torture-bench/cases/03-random-typography/src/components/Hero.jsx:7` | <span className="text-[13px]">Trusted by teams</span> | high |
| INFO | `missing-skill-frontend-ui-engineering` | `N/A` | Complex UI framework detected without explicit UI engineering guards. | high |
| INFO | `missing-skill-chrome-devtools` | `N/A` | Web project detected. Agent lacks live browser validation. | high |
| INFO | `missing-skill-a11y-debugging` | `N/A` | High risk of inaccessible modals, missing ARIA tags, and bad contrast. | high |

## 4. Auto Repairs Applied

- **DESIGN.md**: appended safe section (`deterministic-focus-management`)

## 5. Agent Handoff Prompt

> Inspect PRODUCT.md, DESIGN.md, AGENTS.md, package.json, routing files, component structure, and existing tests. Read `.unslop/fix-list.md` and resolve any listed issues. Implement only the requested scope while preserving existing behavior. Before completion, run `npx unslop audit`, ensure there are 0 errors, and show the final output score and readiness.

## 6. Verification Checklist
- [ ] Build succeeds without errors
- [ ] Mobile viewports (320px, 375px, 390px) checked
- [ ] Keyboard navigation and focus traps work
- [ ] RTL layout checked (if applicable)
- [ ] Overlays and modals render correctly without scroll cutoff