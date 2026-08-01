---
name: unslop-preflight
description: Preflight AI-assisted frontend work by creating, auditing, repairing, and scoring PRODUCT.md, DESIGN.md, AGENTS.md, and source code before implementation. Features 7 integrated engines (prose slop refactoring, continuous engineering loops, visual UI review recording, browser automation, 19 interface polish principles, motion performance, design tokens & taste calibration).
---

# Unslop Preflight (v1.15.0)

## What this skill does

Use this skill before an AI coding agent starts frontend implementation, or when reviewing/repairing an existing frontend codebase.

Unslop Preflight turns vague product or UI requests into a safe, deterministic, high-quality implementation handoff. It integrates 7 native engines:

1. **`no-ai-slop` Engine**: Copy & prose slop scanning and refactoring (`unslop scan --prose`).
2. **`loop-engineering` Engine**: Continuous L1/L2 autonomous engineering loops (`unslop loop`).
3. **`ui-review-loop` Engine**: Browser UI review recording, DOM timeline capture, HAR network tracing, and 100% coverage audits (`unslop review`).
4. **`browser-use` Engine**: Headless browser automation, DOM tree parsing, accessibility tree extraction, and viewport layout overflow checking.
5. **`make-interfaces-feel-better` Engine**: 19 design engineering polish principles (`unslop scan --feel`).
6. **`ui-skills` Engine**: Baseline UI quality, motion performance restraints, and metadata governance.
7. **`ux-ui-agent-skills` Engine**: Multi-agent design tokens governance, WCAG 2.2 Level AA/AAA accessibility rules, and taste calibration matrix.

---

## When to use this skill

Use it for:
- SaaS dashboards, web applications, and admin panels
- landing pages and marketing product pages
- Arabic, RTL, bilingual, or localization-sensitive interfaces
- UI redesigns that feel generic, fragile, or AI-generated
- frontend repositories that need readiness checks before agent implementation
- modal, drawer, dropdown, tooltip, toast, z-index, overflow, or viewport failures
- projects where `PRODUCT.md`, `DESIGN.md`, or `AGENTS.md` is missing, weak, or stale
- vibe-coded projects that need a clearer AI-agent handoff and safe source repairs

Do not use it for backend-only tasks, database-only tasks, or non-UI scripts.

---

## Primary workflow

When a user asks for frontend implementation, UI repair, UI audit, design-system preparation, or agent-readiness work:

1. Identify the project mode.
2. Inspect existing `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, `README.md`, `package.json`, and frontend source directories.
3. Extract useful context before asking questions.
4. Create or repair missing handoff artifacts (`unslop init`).
5. Run Unslop CLI commands when available and appropriate:
   - `npx unslop-preflight autopilot --safe-fix --verify`
   - `npx unslop-preflight scan src --strict`
   - `npx unslop-preflight scan --prose`
   - `npx unslop-preflight scan --feel`
6. Report the readiness band, score, category breakdown, blockers, fix list, and next action.
7. Do not proceed to broad frontend implementation while readiness is `blocked` or `needs-spec-work`.

---

## Project modes

| Mode | Use when |
| :--- | :--- |
| `fresh-seed` | No trustworthy product or design handoff exists yet |
| `existing-scan` | A repository exists and needs audit or source scanning |
| `redesign` | Existing UI feels generic, inconsistent, fragile, or AI-made |
| `implementation` | Handoff artifacts exist and the user wants code changes |
| `audit` | The user wants a quality review or readiness decision |
| `repair` | The user wants safe artifact & source fixes without broad rewrites |
| `root-cause-fix` | The user reports broken UI, clipping, z-index, overflow, modal, or layout failure |
| `harness-readiness` | The user wants to choose only the agent skills and tools needed now |

---

## Artifact contracts

### PRODUCT.md
Product & strategy context: product name, category, core users, situation, primary job to be done, product promise, brand traits, UX risks, accessibility needs, localization needs, writing tone, anti-references, and success criteria.

### DESIGN.md
Implementation-facing design contract: Design Read, Taste Controls, Design System Decision, visual direction, color tokens, typography scale, spacing/density rules, component contracts, responsive behavior, accessibility rules, directionality rules, modal viewport contract, stacking & z-index reasoning, and pre-flight check.

### AGENTS.md
Repository-specific agent instructions: change-size policy, files to read before coding, commands to run, testing expectations, accessibility/privacy requirements, readiness rules, Root Cause Mode sequence, and fix-list handling.

---

## Readiness Bands

| Readiness | Meaning | Action |
| :--- | :--- | :--- |
| 🔴 `blocked` | Critical blockers or spec gaps remain | Stop work; do not implement yet |
| 🟡 `needs-spec-work` | Handoff exists but is too vague/sparse | Repair or rewrite docs first |
| 🟢 `agent-ready-with-fix-list` | Mostly ready, but safe fixes remain | Apply fix list, then rerun |
| 🔵 `agent-ready` | Handoff & source are fully verified | Proceed with confidence |

---

## Recommended Commands

```bash
# Instant preflight & safe auto-repair
npx unslop-preflight autopilot --safe-fix --verify --report --strict

# Initialize handoff docs
npx unslop-preflight init

# Source code slop scan
npx unslop-preflight scan src --strict

# Prose & copy slop scan
npx unslop-preflight scan --prose

# Interface feel & polish scan
npx unslop-preflight scan --feel

# Continuous loop status
npx unslop-preflight loop status

# UI review recording
npx unslop-preflight review start --url http://localhost:3000
```

---

## Skills.sh Installation

```bash
npx skills add imMamdouhaboammar/unslop-preflight
```
