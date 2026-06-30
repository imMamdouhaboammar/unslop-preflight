<div align="center">

# Unslop

The package name is `unslop-preflight`.

### Stop AI coding agents before they ship fragile frontend work.

**A preflight system for AI-built frontends. It checks `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, and source code before implementation moves forward.**

[![npm](https://img.shields.io/npm/v/unslop-preflight?style=flat-square&color=5B21B6&logo=npm&logoColor=white)](https://www.npmjs.com/package/unslop-preflight)
[![npm downloads](https://img.shields.io/npm/dm/unslop-preflight?style=flat-square&color=5B21B6&logo=npm&logoColor=white&label=installs)](https://www.npmjs.com/package/unslop-preflight)
[![Socket Supply Chain](https://img.shields.io/badge/supply%20chain-78%2F100-F59E0B?style=flat-square&logo=socket&logoColor=white)](https://socket.dev/npm/package/unslop-preflight)
[![Socket Vulnerability](https://img.shields.io/badge/vulnerability-100%2F100-22C55E?style=flat-square&logo=socket&logoColor=white)](https://socket.dev/npm/package/unslop-preflight)
[![Socket Quality](https://img.shields.io/badge/quality-100%2F100-22C55E?style=flat-square&logo=socket&logoColor=white)](https://socket.dev/npm/package/unslop-preflight)
[![Socket Maintenance](https://img.shields.io/badge/maintenance-90%2F100-22C55E?style=flat-square&logo=socket&logoColor=white)](https://socket.dev/npm/package/unslop-preflight)
[![Socket License](https://img.shields.io/badge/license-100%2F100-22C55E?style=flat-square&logo=socket&logoColor=white)](https://socket.dev/npm/package/unslop-preflight)
[![CI](https://img.shields.io/github/actions/workflow/status/imMamdouhaboammar/unslop-preflight/ci.yml?style=flat-square&logo=githubactions&logoColor=white&label=CI)](https://github.com/imMamdouhaboammar/unslop-preflight/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/imMamdouhaboammar/unslop-preflight?style=flat-square&color=5B21B6&logo=github&logoColor=white&label=release)](https://github.com/imMamdouhaboammar/unslop-preflight/releases)
[![skills.sh](https://img.shields.io/badge/skills.sh-published-0EA5E9?style=flat-square&logo=skillsdotsh&logoColor=white)](https://skills.sh/imMamdouhaboammar/unslop-preflight)
[![Gates](https://img.shields.io/badge/gates-23%2B%20readiness-F59E0B?style=flat-square)](./SKILL.md)
[![Docs v1.11.2](https://img.shields.io/badge/docs-1.11.2-3B82F6?style=flat-square)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-22C55E?style=flat-square)](./LICENSE)

```bash
npx unslop-preflight autopilot
```

One command creates or repairs `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md`, runs readiness gates, scans frontend source, writes reports, and gives the coding agent a fix list before it starts guessing.

[Quick Start](#quick-start) · [Cleanup Prompt](#copypaste-cleanup-prompt-for-vibe-coders) · [What it flags](#what-it-flags) · [Source detectors](#source-slop-detectors) · [Readiness](#readiness-bands) · [CLI](#cli-reference) · [Docs](#documentation-map)

</div>

## Why Unslop exists

AI made frontend building faster.

It also made weak frontend decisions easier to repeat.

The oversized hero headline. The glass card stack. The purple gradient that has no reason to exist. The modal that works on desktop and breaks on mobile. The dropdown clipped by an `overflow-hidden` parent. The `z-9999` patch that hides the real stacking problem. The form that looks finished until keyboard users try to move through it.

That is the work Unslop is built to flag before it ships.

Unslop is a preflight layer for AI-assisted UI work. It checks the brief, design contract, agent handoff, and source code before a coding agent continues. It does not try to slow the agent down. It gives the agent sharper boundaries.

## Benchmark Results & Limitations

> [!WARNING]
> **Torture Bench Status: ❌ FAIL (Current Score: 3.00 / 5.0)**
>
> The latest execution of the internal **Unslop Torture Bench** resulted in an average score of **3.00 / 5.0**, which is below our strict quality threshold of **4.0**.
>
> This benchmark failure highlights key gaps in dynamic overlay edge-case detection and complex responsive layout scanning. Active efforts are underway to harden rule sets and tune scanners, but users should maintain realistic expectations.

Unslop is a **preflight assistant and guardrail**, not a visual or testing replacement. It cannot and does not replace:
- **E2E Testing / Integration Tests:** Unslop checks static conditions and source patterns, but does not execute or verify runtime app behavior.
- **Manual Accessibility Reviews:** Code pattern scanning flags missing labels and bad elements, but only manual screen-reader and keyboard testing guarantees full compliance.
- **Browser QA & Visual Audits:** Unslop does not render the UI; visual bugs, layout overlaps, and browser compatibility issues must be validated using live browsers.

## What it flags

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
npx unslop-preflight autopilot
```

Install in a project:

```bash
npm install --save-dev unslop-preflight
npx unslop-preflight autopilot
```

Initialize only the docs:

```bash
npx unslop-preflight init
npx unslop-preflight audit
npx unslop-preflight repair --dry-run --report
```

Scan source code directly:

```bash
npx unslop-preflight scan src
npx unslop-preflight scan src --strict
```

Skip source scanning when you only want spec checks:

```bash
npx unslop-preflight autopilot --no-source-scan
```

Install as a skill:

```bash
npx skills add imMamdouhaboammar/unslop-preflight
```

## Copy/Paste Cleanup Prompt for Vibe Coders

If you are a non-technical builder using AI coding agents like Claude Code, Cursor, Codex, Antigravity, or any other agent, you can easily delegate the cleanup work to your assistant. 

Copy the prompt block below, paste it into your coding agent, and it will automatically inspect your project structure, install and run **Unslop Preflight**, generate detailed findings in `.unslop/report.md`, `.unslop/report.json`, and `.unslop/fix-list.md`, apply safe fixes, and walk you through any remaining manual cleanups.

> [!TIP]
> **Not technical? Copy this prompt into your coding agent and let it clean up the AI slop for you.**

```txt
You are my cleanup agent.

I want you to inspect this project, install and run Unslop Preflight, then fix the issues it reports.

Follow these steps carefully:

1. First, inspect the project structure.
   Look for package.json, README, src/, app/, components/, pages/, styles, and any existing tests.

2. Check which package manager this project uses.
   If there is pnpm-lock.yaml, use pnpm.
   If there is package-lock.json, use npm.
   If there is yarn.lock, use yarn.
   Do not switch package managers.

3. Run Unslop Preflight with the correct direct command:

   npx unslop-preflight autopilot --safe-fix --verify --report --strict

   (Fallback: If the project is important or unstable, run first in plan-only mode:
    npx unslop-preflight autopilot --plan-only --report)

4. After it runs, open and read:

   .unslop/report.md
   .unslop/report.json
   .unslop/fix-list.md
   .unslop/source-fixes.md (if present)

5. Fix the project based on the fix list.

   Important:
   - Apply safe documentation/spec fixes first.
   - Fix source code issues carefully.
   - Do not rewrite the whole app.
   - Do not delete files unless clearly necessary.
   - Do not change product behavior unless the report clearly requires it.
   - Do not touch secrets, .env files, tokens, or credentials.
   - Do not install new dependencies unless you explain why they are needed.

6. Focus especially on:
   - generic AI-looking UI
   - broken responsive behavior
   - modal and overlay issues
   - missing loading, empty, and error states
   - accessibility problems
   - weak focus states
   - unsafe links
   - hardcoded sample data
   - messy component structure
   - unclear PRODUCT.md, DESIGN.md, or AGENTS.md handoff

7. After fixing, run Unslop again:

   npx unslop-preflight autopilot --safe-fix --verify --report --strict

8. Repeat until:
   - the report has no critical blockers
   - the fix-list is small and clear
   - the app still builds
   - the changes are easy to review

9. Run the project’s normal checks.
   Use the scripts available in package.json, such as:

   npm run build
   npm run test
   npm run lint
   npm run typecheck

   Use the project’s actual package manager.

10. At the end, give me a clear summary:

   - What Unslop found
   - What you fixed
   - What files you changed
   - What commands you ran
   - What checks passed
   - What still needs human review

Do not claim everything is fixed unless the report and checks prove it.
```

### What Unslop does (and doesn't do)

* **Preflight Guard, Not a Magic Fixer:** Unslop acts as a preflight guard and fix-list generator. It helps your agent see problems before shipping, but it does not automatically rewrite your source files or replace real manual review.
* **Checks, Not Replacements:** It does not replace browser QA, real tests, accessibility tooling, or human review.
* **Sharper Handoffs:** It is designed to give your coding agent a sharper checklist, not blind permission to rewrite the project.

Copy it. Paste it into your coding agent. Let the agent run the audit, read the report, apply the fix list, and come back with a clean summary.

## What is current in v1.11.2

v1.11.2 brings complete, robust CLI command standardizations (`npx unslop-preflight <command>`), seamless autopilot standards-wiring integration (`--standards=vibe-coding`), self-scanning test safety, and softened, benchmark-grounded assistance framing.

v1.11.1 delivered a robust Autopilot Hardening loop (`--max-passes=N`), pass history diagnostics, and native scanner failure metadata collection, built on top of the v1.11.0 Modular Standards Packs (e.g. Vibe Coding Profile) and the v1.10.x source-level linter.

New in v1.10.x:

- `unslop scan` command for direct frontend source scanning
- source slop detectors for React keys, focus states, images, links, inputs, motion, async views, empty states, color drift, sample data, and generic visual stacks
- file-scoped scanner rules for checks that need full-file context
- file exclusions for token, theme, test, story, fixture, and mock files where a signal would create noise
- `--no-source-scan` works inside autopilot
- source findings appear as code evidence in reports and fix lists
- npm publish workflow with GitHub Actions, Trusted Publishing support, package pack verification, tests, and duplicate-version skip

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
npx unslop-preflight autopilot
```

The package's primary command is `npx unslop-preflight autopilot`. After installing the package locally or globally, the shorter `unslop` bin alias is also fully available:

```bash
unslop autopilot
```

`autopilot` has two levels:

1. **Preflight loop**:
   Scans, scores, repairs safe handoff docs, and creates fix-lists.

2. **Safe repair loop**:
   With `--safe-fix`, applies deterministic low-risk source patches and verifies them.

### Repair Modes

- `--plan-only`: Run scan, audit, and report only. Do not write or modify any files.
- `--doc-fix` (Default): Apply safe `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` repairs only. Does not modify source code.
- `--safe-fix`: Apply safe doc repairs AND safe source-code fixes (deterministic, low-risk, idempotent).
- `--agent-fix`: Do not modify source code directly. Instead, generate a stronger, tailored agent patch prompt in `.unslop/agent-fix-prompt.md`.

> [!NOTE]
> **Honest Note**: Unslop does not rewrite your app. Unslop only applies low-risk deterministic fixes. Complex architectural fixes stay in the fix list for a coding agent or human.

### Verification Loop

With `--verify`, Unslop automatically detects your project's lockfile/package manager (`npm`, `pnpm`, `yarn`, `bun`), extracts available build-time checks from `package.json` (like `typecheck`, `lint`, `test`, `build`), runs them synchronously under a configurable timeout (`--verify-timeout=120`), and summarizes before/after improvements in `.unslop/report.md` and `.unslop/report.json`.

### Options & Hardening

* **Bounded Refinement Loop (`--max-passes=N`)**: Specifies the maximum number of correction passes (1 to 10) autopilot runs in a single session.
* **Detailed Reports (`.unslop/`)**: Autopilot writes reports to `.unslop/report.md`, `.unslop/report.json`, `.unslop/fix-list.md`, and (in `--safe-fix` mode) `.unslop/source-fixes.json`, `.unslop/source-fixes.md`, and `.unslop/patch-summary.md`. The reports include:
  * `beforeAfter`: Before/after delta tracking of scores, blockers, and findings.
  * `verificationResults[]`: Exit codes, timeouts, status, and summary of each run check.
  * `passes[]`: Pass-by-pass history of scores, applied repairs, and results.
  * `stopReason`: Clean stopping motivation (`agent-ready`, `no-safe-repairs`, `no-score-improvement`, `max-passes`, or `error`).
  * `scanStats`: Detailed statistics (files scanned/skipped, findings, scanner failures, run duration, and directories scanned).
* **Robust Scanner Failure Handling**: Scanner execution or file-walk errors do not crash the process; they are recorded as warning metadata in reports. In `--strict` mode, scanner failures are treated as blocking evidence, causing the check to fail.
* **Compatibility Code Fix Flag (`--apply-code-fixes`)**: The `--apply-code-fixes` flag is kept for compatibility. It correctly reports `requested: true` and `applied: false` with the reason `not-implemented` inside output metadata. Autopilot does not automatically modify or rewrite source files.

Useful option syntax:

```bash
npx unslop-preflight autopilot --plan-only
npx unslop-preflight autopilot --doc-fix
npx unslop-preflight autopilot --safe-fix --verify
npx unslop-preflight autopilot --agent-fix --report
npx unslop-preflight autopilot --max-passes=5
npx unslop-preflight autopilot --strict
```

## Source slop detectors

Run source scanning directly:

```bash
npx unslop-preflight scan src
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

## Modular Standards Packs (Profiles)

Unslop supports an optional, opt-in **Modular Standards Pack System** to enforce rigorous, domain-specific or team-specific coding governance rules. By default, Unslop runs lightweight, but power users can activate strict standard profiles.

The first integrated pack is the **Vibe Coding Standards Pack** (`vibe-coding`), enforcing strict TypeScript type safety, unified dependency architecture, component modularity, centralized storage, and secret exposure checks.

To list and inspect available standards packs:
```bash
npx unslop-preflight standards list
npx unslop-preflight standards inspect vibe-coding
```

To run audits or scans enforcing a standards pack:
```bash
npx unslop-preflight scan src --standards=vibe-coding
npx unslop-preflight autopilot --standards=vibe-coding
```

Read [`docs/STANDARDS_PACKS.md`](./docs/STANDARDS_PACKS.md) and [`docs/VIBE_CODING_STANDARDS_PACK.md`](./docs/VIBE_CODING_STANDARDS_PACK.md) for more details.

## npm publishing

This repository is prepared for automatic npm publishing through GitHub Actions.

Recommended npm trusted publisher settings:

```text
Owner: imMamdouhaboammar
Repository: unslop-preflight
Workflow filename: npm-publish.yml
Allowed action: npm publish
```

The workflow tests the package, runs `npm pack --dry-run`, checks whether the package version already exists on npm, and publishes only if the version is new.

Read [`docs/NPM_PUBLISHING.md`](./docs/NPM_PUBLISHING.md).

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
npx unslop-preflight <command> [args]
```

| Command | What it does |
|---------|--------------|
| `autopilot` | Runs init, audit, safe repair, source scans, reports, and fix-list generation |
| `preflight` | Alias for `autopilot` |
| `init` | Creates missing `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` |
| `audit` | Runs artifact gates and prints score, readiness, and category breakdown |
| `scan` | Runs source scanners against frontend code |
| `standards` | Lists or inspects available modular standards packs (profiles) |
| `repair` | Adds safe missing sections and prepares agent-readable fixes |
| `report` | Writes `.unslop/report.md` and `.unslop/report.json` |
| `doctor` | Checks runtime and project assumptions |
| `update` | Updates the CLI package |

Common usage:

```bash
npx unslop-preflight init
npx unslop-preflight audit --verbose
npx unslop-preflight scan src --strict
npx unslop-preflight repair --dry-run --report
npx unslop-preflight autopilot
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
| [`docs/NPM_PUBLISHING.md`](./docs/NPM_PUBLISHING.md) | GitHub Actions and npm Trusted Publishing setup |
| [`docs/AI_AGENT_READINESS.md`](./docs/AI_AGENT_READINESS.md) | Readiness, taste, placeholder, and report behavior |
| [`docs/SOURCE_SLOP_DETECTORS.md`](./docs/SOURCE_SLOP_DETECTORS.md) | Source-level detector behavior |
| [`docs/STANDARDS_PACKS.md`](./docs/STANDARDS_PACKS.md) | Modular profile-based standards pack system |
| [`docs/VIBE_CODING_STANDARDS_PACK.md`](./docs/VIBE_CODING_STANDARDS_PACK.md) | Enforced Vibe Coding rules and remediation |
| [`docs/ROOT_CAUSE_MODE.md`](./docs/ROOT_CAUSE_MODE.md) | Diagnosis-first governance for bugs and layout failures |
| [`docs/OVERLAY_LAYERING_GATES.md`](./docs/OVERLAY_LAYERING_GATES.md) | Modal viewport, stacking, z-index, and overlay reasoning |
| [`docs/INSTALL_AGENT_HARNESS.md`](./docs/INSTALL_AGENT_HARNESS.md) | Project-specific skill and tool harness recommendations |
| [`references/`](./references/) | Detailed rule references |
| [`assets/`](./assets/) | Templates used to generate project artifacts |

## Repository structure

```text
unslop-preflight/
├── .github/workflows/            npm publish automation
├── bin/                          CLI entrypoint
├── src/
│   ├── commands/                 init, audit, repair, report, autopilot, scan
│   ├── core/                     auditor, scanners, reporter, filesystem helpers
│   ├── rules/                    product, design, taste, placeholder, root-cause, harness, overlay, UX rules
│   └── scanners/                 source-level UI, layout, typography, overlay, responsive detectors
├── scripts/                      standalone scanners and validators
├── assets/                       generated artifact templates
├── references/                   detailed rule references
├── docs/                         documentation for system behavior
├── tests/                        Node test runner coverage
├── AGENTS.md                     agent guidance for this repository
├── SKILL.md                      skill runtime instructions
├── CHANGELOG.md                  release history
└── package.json
```

## Recommended workflow

```bash
npx unslop-preflight autopilot
# read the readiness band and fix list
# apply required fixes
npx unslop-preflight scan src --strict
npx unslop-preflight autopilot
# proceed only when readiness is agent-ready or the team accepts the remaining risk
```

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before adding a gate, scanner, template, or documentation update. Any behavior change should update tests and docs in the same pull request.

<div align="center">

**Built for AI-first frontend workflows that need judgment before code.**

[GitHub](https://github.com/imMamdouhaboammar/unslop-preflight) · [npm](https://www.npmjs.com/package/unslop-preflight) · [skills.sh](https://skills.sh/imMamdouhaboammar/unslop-preflight) · [Issues](https://github.com/imMamdouhaboammar/unslop-preflight/issues)

</div>
