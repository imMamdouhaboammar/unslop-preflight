# Vibe Design MD Architect

[![Install with skills CLI](https://img.shields.io/badge/skills.sh-install-5B21B6?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMCAxN2wtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIvPjwvc3ZnPg==)](https://skills.sh/imMamdouhaboammar/vibe-design-md-architect/vibe-design-md-architect)
[![Version](https://img.shields.io/badge/version-1.7.0-22C55E?style=flat-square)](./CHANGELOG.md)
[![Gates](https://img.shields.io/badge/gates-23-F59E0B?style=flat-square)](./SKILL.md)
[![License](https://img.shields.io/badge/license-MIT-3B82F6?style=flat-square)](./LICENSE)

A packaged Claude Skill for creating, auditing, and amplifying `PRODUCT.md` and `DESIGN.md` before UI implementation. Blocks generic AI-looking frontend before a single line of code is written.

---

## Quick Install

```bash
npx skills add imMamdouhaboammar/vibe-design-md-architect
```

Or install a specific skill from this repository:

```bash
npx skills add https://github.com/imMamdouhaboammar/vibe-design-md-architect --skill vibe-design-md-architect
```

After at least one install, skills.sh discovers the repository through CLI telemetry and creates the public skill page.

---

## What it does

Vibe Design MD Architect is a design-planning gate that runs **before** any frontend code. It forces a structured design decision process, blocks generic AI UI defaults, and produces two authoritative artifacts:

- **`PRODUCT.md`** — product strategy, user context, brand register, accessibility and localization needs.
- **`DESIGN.md`** — six-section design system: overview, colors, typography, elevation, components, do's and don'ts.

It is built for vibe coding workflows where the agent often starts producing generic AI-looking frontend, skips intake, ignores RTL, misses accessibility, or invents visual defaults during coding.

---

## Structure

```text
vibe-design-md-architect/
  SKILL.md              ← skill trigger and workflow instructions
  scripts/              ← validation, scanning, gate runner, amplify, viewport
  references/           ← design rules, RTL guidance, overlay system, dashboards
  assets/               ← reusable templates for PRODUCT.md, DESIGN.md, prompts
  evals/                ← test prompts and scoring rubric
  CHANGELOG.md
  PUBLISHING.md
  CONTRIBUTING.md
```

---

## Install into a project

For Claude Code project-level usage:

```bash
mkdir -p .claude/skills
cp -R vibe-design-md-architect .claude/skills/
```

For user-level usage:

```bash
mkdir -p ~/.claude/skills
cp -R vibe-design-md-architect ~/.claude/skills/
```

---

## Mandatory Impeccable setup

Run this from the project root before generating or implementing UI when shell access exists:

```bash
npx impeccable skills install
```

Alternative:

```bash
npx skills add pbakaus/impeccable
```

---

## Recommended companion: Vibe Driven Dev (VDD)

Install [Vibe Driven Dev](https://github.com/OpenOps-Studio/vibe-driven-dev) (`vibe-driven-dev`, by OpenOps Studio) alongside Impeccable. VDD is the pre-execution layer that turns a vague idea into structured artifacts (PRD, scope, architecture, stack decisions) and prepares a clean handoff into systems such as Spec Kit.

| Tool | Responsibility |
|------|---------------|
| **VDD** | Product truth, scope, stack, architecture, audit, handoff — the layer before design |
| **This skill** | `PRODUCT.md`, `DESIGN.md`, design context, rules engine, anti-slop gates |
| **Impeccable** | Frontend design intelligence, slop detection, live iteration during build |

Recommended order: VDD first when scope or stack is unclear → this skill for `PRODUCT.md`/`DESIGN.md` → Impeccable for the build.

```bash
npm install -g vibe-driven-dev
# or, per project:
npx vibe-driven-dev install claude-code --project
vdd doctor
vdd run /vibe.start
```

VDD is recommended, not a hard gate. Impeccable remains the mandatory design-intelligence setup.

---

## Design System Baseline — first mandatory intake question

The first question the skill asks before any design work:

```text
Which design system baseline should guide this project?

1. Atlassian Design System
2. Lightning Design System (Salesforce)
3. Polaris (Shopify)
4. Material Design
5. Human Interface Guidelines (Apple)
6. Custom / hybrid, with a short explanation
```

The selection is recorded in `INTAKE.session.md`, `PRODUCT.md`, `DESIGN.md`, `STANDARDS.search-notes.md`, and the implementation prompt. It guides component behavior, interaction logic, density, and platform conventions without copying another company's brand skin.

---

## 23 Hard-Blocking Gates

Implementation is blocked until all required gates are attempted and blockers are repaired.

| # | Gate | Purpose |
|---|------|---------|
| 1 | Design System Baseline Gate | First mandatory intake question — select a baseline before any design work |
| 2 | Intake Session Gate | Extract product context, user, job-to-be-done, risks, and localization before design |
| 3 | 2026 Standards Search Gate | Verify WCAG 2.2, MDN Baseline, web.dev, and framework docs before finalizing rules |
| 4 | Impeccable Install Gate | Run `npx impeccable skills install` before UI work |
| 5 | PRODUCT.md Gate | `PRODUCT.md` must exist and pass the contract before design or code |
| 6 | DESIGN.md Six-Section Gate | Exactly six top-level sections: Overview, Colors, Typography, Elevation, Components, Do's and Don'ts |
| 7 | Strict Rules Engine Gate | All gate checks pass before `DESIGN.md` is considered valid |
| 8 | Accessibility & Directionality Gate | Contrast, focus, ARIA, RTL/LTR rules declared and correct |
| 9 | UX-CRX Gate | Primary action, secondary action, recovery path, and decision point declared per screen |
| 10 | Mobile & Responsive Gate | Mobile designed, not stacked; container/content-driven breakpoints |
| 11 | Popup & Feedback System Gate | In-app modal/drawer/toast/banner/inline validation; no native browser popups |
| 12 | Implementation Scan Gate | `scan-ui-implementation.mjs` blockers cleared |
| 13 | Amplify Preservation Gate | (Amplify Mode) Preserves strong product-specific decisions; removes generic AI patterns |
| 14 | Semantic HTML & Interaction Gate | No clickable divs; keyboard operability; landmarks; labeled icons |
| 15 | Realistic Content Gate | No lorem ipsum, John Doe, example.com, fake metrics, Item 1/2/3 |
| 16 | Design Token Gate | No hardcoded hex, fixed padding, or magic numbers; use documented tokens |
| 17 | Drift Control Gate | Single source of truth; no invented tokens; gates re-run per merge |
| 18 | Viewport Governance Gate | Scroll ownership declared per route; no false `overflow:hidden` fixes; `dvh` fallback |
| 19 | Modal, Dialog & Overlay Governance Gate | Full modal contract: focus trap, scroll lock, backdrop, viewport-safe sizing |
| 20 | Dashboard Shell & Layout Governance Gate | Declared grid, explicit scroll ownership, auth action hierarchy, form quality |
| 21 | Overlay Stack & Collision Governance Gate | Centralized overlay system; toast construction ban; collision-aware placement |
| 22 | Sensitive Data Display Governance Gate | Tokens masked; secure creation via modal; destructive actions require confirmation |
| 23 | Popup & Floating Element Positioning Gate | Declared Strategy A/B/C; flip/shift/size middleware required; portal mounting; z-index tokens |

---

## Preflight

From the project root:

```bash
bash .claude/skills/vibe-design-md-architect/scripts/impeccable-preflight.sh
```

Or, if running from this skill folder:

```bash
bash scripts/impeccable-preflight.sh
```

The preflight creates or checks: `INTAKE.session.md`, `STANDARDS.search-notes.md`, `PRODUCT.md`, `DESIGN.md`, Impeccable setup, validation, scoring, rules engine gates, and implementation scan when `src/` exists.

---

## Main commands

```bash
node scripts/intake-session.mjs
node scripts/standards-search-brief.mjs PRODUCT.md DESIGN.md
node scripts/bootstrap-design-artifacts.mjs
node scripts/validate-design-md.mjs DESIGN.md
node scripts/score-design-md.mjs DESIGN.md PRODUCT.md
node scripts/run-gates.mjs DESIGN.md PRODUCT.md src
node scripts/scan-ui-implementation.mjs src
node scripts/scan-accessibility.mjs src
node scripts/scan-viewport-fit.mjs http://localhost:3000
```

Or use the npm scripts:

```bash
npm run validate:design
npm run score:design
npm run gates
npm run scan:ui
npm run scan:a11y
npm run scan:viewport
```

---

## Amplify Mode

Use Amplify Mode when you have an old or weak `design.md` and want the skill to repair it.

```bash
node scripts/amplify-design-md.mjs DESIGN.md PRODUCT.md
node scripts/validate-design-md.mjs DESIGN.amplified.md
node scripts/score-design-md.mjs DESIGN.amplified.md PRODUCT.md
```

The script creates a diagnostic report and a scaffold. Claude completes the actual amplification using `SKILL.md` and `references/amplify-workflow.md`.

Suggested prompt:

```text
Use vibe-design-md-architect in Amplify Mode. Read my old design.md, preserve what is strong,
remove what is generic or AI-looking, run the intake and standards gates, then produce
DESIGN.amplification-report.md plus DESIGN.amplified.md. Do not start implementation.
```

---

## Code scanners

Three static/runtime scanners run on the frontend source:

| Scanner | Invoked by | What it flags |
|---------|-----------|---------------|
| `scan-ui-implementation.mjs` | `run-gates.mjs` | AI UI slop, native popups, clickable divs, lorem ipsum, blanket `overflow:hidden`, exposed secrets, modal issues, toast misuse |
| `scan-accessibility.mjs` | `run-gates.mjs` | ARIA, landmark, semantics audit (WCAG 2.2 mapped). Use `--strict` to fail on warnings too |
| `scan-viewport-fit.mjs` | Manual / CI | Playwright-based runtime scanner at 8 viewport sizes; checks horizontal overflow and unnecessary scroll |

The viewport scanner requires `npx playwright install chromium` and a running dev server.

---

## Hard UI rules added in this version

- **Contrast discipline** — every text, border, focus, chart, and control state defined.
- **AI color ban** — no purple/blue/teal/neon defaults; every color is a named semantic token.
- **Icon integrity** — no sparkle, magic, robot, or emoji icons as core UI language.
- **Directionality** — LTR by default; RTL only when product confirms Arabic/Hebrew/RTL primary language.
- **UX-CRX logic** — primary action, secondary action, recovery path declared per screen.
- **Responsive first-class** — mobile designed, not stacked from desktop.
- **Semantic HTML baseline** — keyboard access, visible focus, reduced motion, accessible feedback.
- **In-app popup system** — no native `alert()`, `confirm()`, or `prompt()`; use modal/drawer/toast/banner/inline.
- **Viewport ownership** — every route declares scroll governance; auth pages = `single-screen-fit`; ban on false `overflow:hidden`.
- **Modal governance** — complete interaction system: focus trapping, scroll lock, inert background, viewport-safe sizing.
- **Overlay stack governance** — centralized overlay system; toast construction ban; collision-aware feedback.
- **Dashboard shell governance** — declared grid, scroll ownership, auth hierarchy, form quality gate.
- **Sensitive data governance** — tokens masked by default; secure creation; destructive confirmation.
- **Popup positioning** — Strategy A (CSS Anchor), B (Floating UI), or C (CSS clamp); portal mounting; z-index token scale.

---

## Core files

- **`SKILL.md`** — skill trigger and full workflow instructions (23 gates, all rules).
- **`scripts/`** — intake, standards search, bootstrap, validate, score, gate runner, amplify, UI scan, a11y scan, viewport scan.
- **`references/`** — design rules, intake protocol, standards search, rules engine, RTL guidance, component contracts, anti-AI UI guidance, `ai-failure-patterns.md` (evidence-based AI UI failures with WCAG mapping), overlay system rules, dashboard shell rules, sensitive data rules.
- **`assets/`** — templates for `INTAKE.session.md`, `STANDARDS.search-notes.md`, `PRODUCT.md`, `DESIGN.md`, implementation prompts, QA checklists.
- **`evals/`** — test prompts and scoring rubric.

---

## Versioning

See [`CHANGELOG.md`](./CHANGELOG.md). Current version: **v1.7**. Latest additions: Generic Directionality (conditional, not Arabic-assumed), Popup and Floating Element Positioning Gate (Gate 23), viewport-safe modal centering, portal mounting rules, and expanded overlay failure checks.

---

## DESIGN.md setup requirement

The generated `DESIGN.md` must visibly include `npx impeccable skills install` under the Overview setup gate and in the Do's and Don'ts implementation guardrails. The coding agent must attempt the command before UI implementation when shell access exists.

---

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how to add a gate, update a template, or improve a scanner rule.
