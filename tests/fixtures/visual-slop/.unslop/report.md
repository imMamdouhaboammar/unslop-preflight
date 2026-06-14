# Unslop Autopilot Report

## 1. Executive Summary
**Score:** 0/100
**Readiness:** blocked
> **Decision:** Do not hand this to an AI coding agent yet. Resolve errors and blocked source issues first.

**Totals:** 20 Blockers | 11 Warnings | 4 Info

## 2. Top Blockers

- **[`unresolved-product-placeholders`]** at `PRODUCT.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`no-sparkle-icons`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`no-brain-icons`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`no-emojis`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict
- **[`unresolved-design-placeholders`]** at `DESIGN.md`
  - *Root Cause:* Design or spec omission
  - *Fix Strategy:* Update the relevant Markdown spec file.
  - *Verify:* Re-run audit --strict

## 3. Evidence Table

| Severity | Rule | Location | Symptom / Excerpt | Confidence |
|----------|------|----------|-------------------|------------|
| ERROR | `unresolved-product-placeholders` | `PRODUCT.md` |  | high |
| ERROR | `no-sparkle-icons` | `DESIGN.md` |  | high |
| ERROR | `no-brain-icons` | `DESIGN.md` |  | high |
| ERROR | `no-emojis` | `DESIGN.md` |  | high |
| ERROR | `unresolved-design-placeholders` | `DESIGN.md` |  | high |
| ERROR | `typography-line-height-missing` | `DESIGN.md` |  | high |
| ERROR | `root-cause-mode-missing` | `AGENTS.md` |  | high |
| ERROR | `install-agent-harness-missing` | `AGENTS.md` |  | high |
| ERROR | `react-harness-recommendation-missing` | `AGENTS.md` |  | high |
| ERROR | `code-review-harness-recommendation-missing` | `AGENTS.md` |  | high |
| ERROR | `modal-viewport-contract-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-internal-scroll-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-viewport-qa-missing` | `DESIGN.md` |  | high |
| ERROR | `modal-fixed-size-risk` | `DESIGN.md` |  | high |
| ERROR | `stacking-plan-missing` | `DESIGN.md` |  | high |
| ERROR | `layer-scale-missing` | `DESIGN.md` |  | high |
| ERROR | `overlay-portal-policy-missing` | `DESIGN.md` |  | high |
| ERROR | `layer-conflict-matrix-missing` | `DESIGN.md` |  | high |
| WARNING | `overlay-missing-portal` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:3` | <div className="fixed z-[99999] inset-0 overflow-y-auto"> | high |
| WARNING | `modal-internal-scroll-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:3` | <div className="fixed z-[99999] inset-0 overflow-y-auto"> | high |
| WARNING | `arbitrary-z-index-slop` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:3` | <div className="fixed z-[99999] inset-0 overflow-y-auto"> | high |
| WARNING | `arbitrary-z-index-slop` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:6` | 1. z-[99999] (arbitrary-z-index-slop) | high |
| WARNING | `modal-internal-scroll-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:7` | 2. fixed and overflow-y-auto without max-height (modal-internal-scroll-risk) | high |
| ERROR | `fixed-width-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:10` | <div className="w-[500px] h-100vh bg-white"> | high |
| WARNING | `height-100vh-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:10` | <div className="w-[500px] h-100vh bg-white"> | high |
| ERROR | `fixed-width-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:13` | 1. w-[500px] (fixed-width-mobile-risk) | high |
| WARNING | `height-100vh-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:14` | 2. h-100vh (height-100vh-mobile-risk) | high |
| WARNING | `oversized-typography-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:16` | <h1 className="text-9xl leading-none">Huge Title</h1> | high |
| WARNING | `leading-none-cutoff-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:16` | <h1 className="text-9xl leading-none">Huge Title</h1> | high |
| WARNING | `oversized-typography-mobile-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:19` | 1. text-[120px] (oversized-typography-mobile-risk) | high |
| WARNING | `leading-none-cutoff-risk` | `/Users/mamdouhaboammar/Documents/antigravity/focused-hypatia/unslop/tests/fixtures/visual-slop/src/components/BadModal.jsx:20` | 2. leading-none on huge text (leading-none-cutoff-risk) | high |
| INFO | `missing-skill-frontend-ui-engineering` | `N/A` | Complex UI framework detected without explicit UI engineering guards. | high |
| INFO | `missing-skill-chrome-devtools` | `N/A` | Web project detected. Agent lacks live browser validation. | high |
| INFO | `missing-skill-a11y-debugging` | `N/A` | High risk of inaccessible modals, missing ARIA tags, and bad contrast. | high |
| INFO | `missing-skill-debug-optimize-lcp` | `N/A` | SSR/SSG framework detected (e.g. Next.js). High risk of LCP / Web Vitals regressions. | high |

## 5. Agent Handoff Prompt

> Inspect PRODUCT.md, DESIGN.md, AGENTS.md, package.json, routing files, component structure, and existing tests. Read `.unslop/fix-list.md` and resolve any listed issues. Implement only the requested scope while preserving existing behavior. Before completion, run `npx unslop audit`, ensure there are 0 errors, and show the final output score and readiness.

## 6. Verification Checklist
- [ ] Build succeeds without errors
- [ ] Mobile viewports (320px, 375px, 390px) checked
- [ ] Keyboard navigation and focus traps work
- [ ] RTL layout checked (if applicable)
- [ ] Overlays and modals render correctly without scroll cutoff