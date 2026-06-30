<div align="center">

# Unslop

### Stop AI coding agents before they ship fragile frontend work.

**A preflight system for AI-built frontends. It checks `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, and source code before implementation moves forward.**

[![Socket Badge](https://badge.socket.dev/npm/package/unslop-preflight/1.10.0)](https://badge.socket.dev/npm/package/unslop-preflight/1.10.0)
[![npm](https://img.shields.io/npm/v/unslop-preflight?style=flat-square&color=5B21B6&label=npm)](https://www.npmjs.com/package/unslop-preflight)
[![skills.sh](https://skills.sh/b/imMamdouhaboammar/unslop-preflight)](https://skills.sh/imMamdouhaboammar/unslop-preflight)
[![Gates](https://img.shields.io/badge/gates-23%2B%20readiness-F59E0B?style=flat-square)](./SKILL.md)
[![Version](https://img.shields.io/badge/docs-1.10.0-3B82F6?style=flat-square)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-22C55E?style=flat-square)](./LICENSE)

```bash
npx unslop autopilot
```

One command creates or repairs `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md`, runs readiness gates, scans frontend source, writes reports, and gives the coding agent a fix list before it starts guessing.

[Quick Start](#quick-start) · [What it catches](#what-it-catches) · [Source detectors](#source-slop-detectors) · [Readiness](#readiness-bands) · [CLI](#cli-reference) · [Docs](#documentation-map)

</div>

## Why Unslop exists

AI made frontend building faster.

It also made weak frontend decisions easier to repeat.

The oversized hero headline. The glass card stack. The purple gradient that has no reason to exist. The modal that works on desktop and breaks on mobile. The dropdown clipped by an `overflow-hidden` parent. The `z-9999` patch that hides the real stacking problem. The form that looks finished until keyboard users try to move through it.

That is the work Unslop is built to stop.

Unslop is a preflight layer for AI-assisted UI work. It checks the brief, design contract, agent handoff, and source code before a coding agent continues. It does not try to slow the agent down. It gives the agent sharper boundaries.

## What it catches

| Area | Examples |
|------|----------|
| Product handoff | vague users, missing job, unclear scope, missing risks |
| Design contract | weak hierarchy, missing tokens, missing responsive rules, missing taste controls |
| Agent guidance | missing `AGENTS.md`, weak handoff rules, bulk install risk |
| Overlay behavior | modal overflow, missing focus trap, missing portal policy, blind z-index fixes |
| Accessibility | clickable divs, missing visible labels, removed focus outlines |
| Responsive layout | fixed widths, `100vh` mobile risk, tables without mobile handling |
| Source slop | random React keys, index keys, sample data, broad transitions, generic visual stacks |
| State handling | async screens without loading, error, and empty states |
| Security and privacy UX | exposed tokens, unsafe new-tab links, weak destructive action flows |

## Quick Start

Run the full loop with npx:

```bash
npx unslop autopilot
```

Install in a project:

```bash
npm install --save-dev unslop-preflight
npx unslop autopilot
```

Initialize only the docs:

```bash
npx unslop init
npx unslop audit
npx unslop repair --dry-run --report
```

Scan source code directly:

```bash
npx unslop scan src
npx unslop scan src --strict
```

Skip source scanning when you only want spec checks:

```bash
npx unslop autopilot --no-source-scan
```

Install as a skill:

```bash
npx skills add imMamdouhaboammar/unslop-preflight
```

## What is current in v1.10.0

v1.10.0 adds a source-level detector layer on top of the existing artifact gates.

New in this release:

- `unslop scan` command for direct frontend source scanning
- source slop detectors for React keys, focus states, images, links, inputs, motion, async views, empty states, color drift, sample data, and generic visual stacks
- file-scoped scanner rules for checks that need full-file context
- file exclusions for token, theme, test, story, fixture, and mock files where a signal would create noise
- `--no-source-scan` now works inside autopilot
- source findings now appear as code evidence in reports and fix lists

## How it works

```text
Prompt or repository
   ↓
PRODUCT.md
   Product strategy, audience, job, risks, localization, accessibility notes
   ↓
DESIGN.md
   Design read, taste controls, tokens, components, overlay rules, responsive contract
   ↓
AGENTS.md
   Project-specific rules for AI coding agents
   ↓
Artifact audit
   Readiness, taste, placeholders, root cause, overlays, harness, accessibility, security
   ↓
Source scan
   UI, accessibility, responsive, layering, typography, and source slop detectors
   ↓
Repair and report
   Safe doc repairs, .unslop/report.md, .unslop/report.json, .unslop/fix-list.md
   ↓
Readiness decision
   blocked, needs-spec-work, agent-ready-with-fix-list, or agent-ready
```

## Autopilot

```bash
npx unslop autopilot
```

Autopilot does the full preflight pass:

1. Fingerprints the project shape.
2. Creates missing `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md`.
3. Runs artifact gates.
4. Runs source scanners when frontend code exists.
5. Applies safe documentation repairs.
6. Writes report files under `.unslop/`.
7. Returns a readiness band and next command.

Useful options:

```bash
npx unslop autopilot --max-passes=5
npx unslop autopilot --no-source-scan
npx unslop autopilot --dry-run
npx unslop autopilot --json
npx unslop autopilot --strict
```

## Source slop detectors

Run source scanning directly:

```bash
npx unslop scan src
```

Current detector coverage:

| Detector | What it flags |
|----------|---------------|
| `unstable-random-key` | React keys based on `Math.random()` or `Date.now()` |
| `array-index-key-reorder-risk` | index keys that can break when lists change |
| `outline-none-without-focus-visible` | removed focus style without keyboard-visible replacement |
| `icon-only-button-review` | icon-only buttons that need accessible-name review |
| `image-without-size-review` | images without sizing contract |
| `target-blank-without-rel` | new-tab links missing `noopener` or `noreferrer` |
| `input-without-autocomplete-review` | email, password, tel, or search inputs without autocomplete behavior |
| `motion-without-reduced-motion-review` | motion without reduced-motion handling |
| `collection-map-empty-state-review` | collection rendering without an obvious empty state |
| `async-view-state-review` | async views missing loading, error, or empty states |
| `hardcoded-color-token-drift` | hex colors outside accepted token or theme files |
| `generic-ai-aesthetic-stack` | generic gradient, glass, and heavy-shadow visual stacks |
| `transition-all-animation-slop` | broad `transition-all` usage |
| `sample-data-shipping-risk` | sample names, placeholder copy, and dummy domains in source |

More detail lives in [`docs/SOURCE_SLOP_DETECTORS.md`](./docs/SOURCE_SLOP_DETECTORS.md).

## Readiness bands

| Band | Meaning | Action |
|------|---------|--------|
| `blocked` | Critical artifact, source, accessibility, security, or root-cause issue | Do not implement yet |
| `needs-spec-work` | The docs exist but are too thin for reliable agent work | Repair or rewrite weak sections |
| `agent-ready-with-fix-list` | The project can move forward only with the fix list attached | Apply the fix list, then rerun |
| `agent-ready` | The handoff is specific enough for AI-assisted implementation | Proceed with normal verification |

Category breakdowns show where the risk lives: product clarity, design contract, taste, placeholders, agent guidance, root cause, harness readiness, responsive behavior, overlays, stacking, accessibility, security, and source scans.

## Reasoning gates

### Root Cause Mode

When the handoff mentions a bug, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, or layout failure, the agent must diagnose before editing.

It must restate the failing state, separate symptom from cause, choose the smallest root fix, check regressions, and provide verification proof.

Read [`docs/ROOT_CAUSE_MODE.md`](./docs/ROOT_CAUSE_MODE.md).

### Modal viewport and overlay gates

When `DESIGN.md` mentions modals, dialogs, popups, drawers, sheets, overlays, lightboxes, popovers, or command palettes, it must define:

- width guard
- height guard
- internal scroll behavior
- mobile behavior
- viewport QA proof

Read [`docs/OVERLAY_LAYERING_GATES.md`](./docs/OVERLAY_LAYERING_GATES.md).

### Stacking and z-index reasoning

Layered UI such as sticky headers, fixed headers, modals, drawers, dropdowns, tooltips, popovers, and toasts must include:

- stacking or placement plan
- stacking context audit
- layer scale
- portal policy
- conflict matrix

Blind `z-9999` or `z-index: 9999` fixes are blocked unless the root-cause analysis proves they are necessary.

## Taste calibration

`DESIGN.md` should include:

- **Design Read**: the agent's interpretation of the product, user, tension, and visual direction.
- **Taste Controls**: `DESIGN_VARIANCE`, `MOTION_INTENSITY`, and `VISUAL_DENSITY`, each from 1 to 10.
- **Design System Decision**: the baseline system and why it fits.
- **Anti-AI-Slop Guidelines**: product-specific patterns to avoid.
- **Agent Handoff**: what the coding agent must preserve.
- **Pre-flight Check**: proof that the design is ready before code starts.

## Install Agent Harness

Many users do not know which agent skills, plugins, scanners, or runtime helpers should be installed before coding.

The Install Agent Harness gate asks the coding agent to inspect the project and recommend a small, relevant harness instead of installing everything.

The agent should explain:

- active host: Claude Code, Codex, Cursor, Gemini CLI, Copilot, Antigravity, OpenCode, Windsurf, or another host
- project shape and current risk
- recommended harness items
- priority: required now, recommended now, optional later, or skip
- why each item matters for this project now
- setup method after source review
- verification and rollback notes

Read [`docs/INSTALL_AGENT_HARNESS.md`](./docs/INSTALL_AGENT_HARNESS.md).

## CLI Reference

```bash
npx unslop <command> [args]
```

| Command | What it does |
|---------|--------------|
| `autopilot` | Runs init, audit, safe repair, source scans, reports, and fix-list generation |
| `init` | Creates missing `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` |
| `audit` | Runs artifact gates and prints score, readiness, and category breakdown |
| `scan` | Runs source scanners against frontend code |
| `repair` | Adds safe missing sections and prepares agent-readable fixes |
| `report` | Writes `.unslop/report.md` and `.unslop/report.json` |
| `doctor` | Checks runtime and project assumptions |
| `update` | Updates the CLI package |

Common usage:

```bash
npx unslop init
npx unslop audit --verbose
npx unslop scan src --strict
npx unslop repair --dry-run --report
npx unslop autopilot
```

## Base gates and readiness-layer checks

| # | Gate | What it enforces |
|---|------|------------------|
| 1 | Design System Baseline | Select a baseline before design work |
| 2 | Intake Session | Capture product, user, job, localization, and risk context |
| 3 | Standards Search | Check current WCAG, MDN, web.dev, and framework guidance when possible |
| 4 | Unslop Install | Record or run relevant setup before UI work |
| 5 | PRODUCT.md | Strategy artifact exists and passes contract |
| 6 | DESIGN.md Contract | Required design sections and decisions exist |
| 7 | Rules Engine | All artifact gates run consistently |
| 8 | Accessibility and Directionality | Focus, contrast, ARIA, LTR by default, RTL when required |
| 9 | UX-CRX Logic | Primary action, secondary action, recovery path, and decision point per screen |
| 10 | Mobile and Responsive | Mobile is designed deliberately, not stacked from desktop |
| 11 | Popup and Feedback System | No native `alert()` or `confirm()` for product flows |
| 12 | Implementation Scan | Source blockers are detected before handoff |
| 13 | Amplify Preservation | Strong existing decisions are kept during repair |
| 14 | Semantic HTML and Interaction | No clickable divs, broken keyboard behavior, or missing landmarks |
| 15 | Realistic Content | No lorem ipsum, fake people, or sample-only records |
| 16 | Design Tokens | No hardcoded hex, magic numbers, or token drift |
| 17 | Drift Control | Single source of truth and gates rerun per merge |
| 18 | Viewport Governance | Scroll ownership, `dvh` fallback, and no root overflow hacks |
| 19 | Modal and Dialog | Focus trap, scroll lock, safe sizing, inert background |
| 20 | Dashboard Shell | Declared grid, scroll ownership, auth hierarchy, form quality |
| 21 | Overlay Stack | Centralized overlays, toast rules, collision handling |
| 22 | Sensitive Data Display | Mask tokens, secure creation flow, destructive confirmations |
| 23 | Popup and Floating Positioning | Strategy A/B/C, flip/shift/size, portal mounting, z-index tokens |

Readiness-layer checks add AGENTS.md resolution, taste calibration, placeholder blocking, root-cause governance, modal viewport gates, stacking reasoning, install-agent-harness readiness, and source slop detectors.

## Generated artifacts

After a healthy run, a project can contain:

```text
PRODUCT.md               product strategy and constraints
DESIGN.md                design contract and implementation rules
AGENTS.md                instructions for AI coding agents
.unslop/report.md        human-readable audit report
.unslop/report.json      machine-readable audit result
.unslop/fix-list.md      agent-readable fix list when source issues exist
```

## Documentation map

| File | Purpose |
|------|---------|
| [`SKILL.md`](./SKILL.md) | Full skill behavior for agent runtimes |
| [`AGENTS.md`](./AGENTS.md) | Repository-level guidance for AI coding agents |
| [`CHANGELOG.md`](./CHANGELOG.md) | Release history |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Gate, scanner, template, and docs update workflow |
| [`docs/AI_AGENT_READINESS.md`](./docs/AI_AGENT_READINESS.md) | Readiness, taste, placeholder, and report behavior |
| [`docs/SOURCE_SLOP_DETECTORS.md`](./docs/SOURCE_SLOP_DETECTORS.md) | Source-level detector behavior |
| [`docs/ROOT_CAUSE_MODE.md`](./docs/ROOT_CAUSE_MODE.md) | Diagnosis-first governance for bugs and layout failures |
| [`docs/OVERLAY_LAYERING_GATES.md`](./docs/OVERLAY_LAYERING_GATES.md) | Modal viewport, stacking, z-index, and overlay reasoning |
| [`docs/INSTALL_AGENT_HARNESS.md`](./docs/INSTALL_AGENT_HARNESS.md) | Project-specific skill and tool harness recommendations |
| [`references/`](./references/) | Detailed rule references |
| [`assets/`](./assets/) | Templates used to generate project artifacts |

## Repository structure

```text
unslop-preflight/
├── bin/                         CLI entrypoint
├── src/
│   ├── commands/                init, audit, repair, report, autopilot, scan
│   ├── core/                    auditor, scanners, reporter, filesystem helpers
│   ├── rules/                   product, design, taste, placeholder, root-cause, harness, overlay, UX rules
│   └── scanners/                source-level UI, layout, typography, overlay, responsive detectors
├── scripts/                     standalone scanners and validators
├── assets/                      generated artifact templates
├── references/                  detailed rule references
├── docs/                        documentation for system behavior
├── tests/                       Node test runner coverage
├── AGENTS.md                    agent guidance for this repository
├── SKILL.md                     skill runtime instructions
├── CHANGELOG.md                 release history
└── package.json
```

## Recommended workflow

```bash
npx unslop autopilot
# read the readiness band and fix list
# apply required fixes
npx unslop scan src --strict
npx unslop autopilot
# proceed only when readiness is agent-ready or the team accepts the remaining risk
```

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before adding a gate, scanner, template, or documentation update. Any behavior change should update tests and docs in the same pull request.

<div align="center">

**Built for AI-first frontend workflows that need judgment before code.**

[GitHub](https://github.com/imMamdouhaboammar/unslop-preflight) · [npm](https://www.npmjs.com/package/unslop-preflight) · [skills.sh](https://skills.sh/imMamdouhaboammar/unslop-preflight) · [Issues](https://github.com/imMamdouhaboammar/unslop-preflight/issues)

</div>
