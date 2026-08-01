# Unslop Preflight Evolution — Deep Native Integration Design

**Date**: 2026-08-01  
**Target Repository**: `unslop-preflight` (v1.14.0 Evolution)  
**Goal**: Natively integrate engines, tools, rules, heuristics, and skills from 7 premier open-source AI, UI, UX, and loop projects into `unslop-preflight`.

---

## Integrated Repositories & Native Roles

1. **`no-ai-slop` (`petergyang/no-ai-slop`)**
   - **Role**: Native Prose & UI Copy Slop Scanner and Refactoring Engine.
   - **Key Features**: Banned word registry (`delve`, `foster`, `leverage`, `utilize`, `robust`, `cutting-edge`, `paradigm shift`), anti-pattern detectors (binary contrasts, throat-clearing, colon reveals, superficial `-ing` clauses, importance puffery, weasel attribution, fake-strong verbs, summary-recap endings, formatting slop, em-dashes).
   - **Integration Point**: `src/scanners/proseScanner.js`, `src/rules/proseSlopRules.js`, `unslop scan --prose`, `unslop repair --prose`.

2. **`loop-engineering` (`cobusgreyling/loop-engineering`)**
   - **Role**: Continuous Engineering Loop Engine (L1/L2 autonomous loops).
   - **Key Features**: Loop status tracking (`STATE.md`, `loop-run-log.md`), token budget enforcement (`loop-budget.md`), gate policies (`gate.yaml`), worktree isolation, automated daily triage, PR babysitter, CI sweeper, and changelog drafter.
   - **Integration Point**: `src/commands/loop.js`, `src/core/loopGate.js`, `src/core/loopState.js`, `unslop loop [init|status|doctor|run]`.

3. **`ui-review-loop` (`amElnagdy/ui-review-loop`)**
   - **Role**: Visual Browser UI Testing & Recording Loop Engine.
   - **Key Features**: Browser testing rounds (video recording + DOM timeline + network HAR tracing), timestamped operator comments, 100% UI coverage audits (`coverage.json`), local review UI server.
   - **Integration Point**: `src/commands/review.js`, `src/core/reviewRecorder.js`, `unslop review [start|run|stop|server|coverage]`.

4. **`browser-use` (`browser-use/browser-use`)**
   - **Role**: Automated Headless Browser Interaction & Viewport Automation Engine.
   - **Key Features**: Accessibility tree extraction, DOM tree parsing, headless Playwright/browser automation, visual viewport fit testing, AI-driven UI interaction verification.
   - **Integration Point**: `src/scanners/browserAutomation.js`, `src/scanners/viewportFit.js`.

5. **`make-interfaces-feel-better` (`jakubkrehel/make-interfaces-feel-better`)**
   - **Role**: Interface Polish & Design Engineering Rule Engine.
   - **Key Features**: 19 design engineering principles (concentric border radius, optical alignment, layered box shadows, interruptible transitions, split & stagger enter/exit, scale on press, font smoothing, tabular numbers, touch/hit area boundaries, motion restraint).
   - **Integration Point**: `src/scanners/interfaceFeelScanner.js`, `src/rules/interfaceFeelRules.js`, `unslop scan --feel`.

6. **`ui-skills` (`ibelick/ui-skills`)**
   - **Role**: Baseline UI Quality & Motion Performance Rules.
   - **Key Features**: Baseline UI checks, motion performance optimization, metadata governance, `DESIGN.md` scoring & generator.
   - **Integration Point**: `src/rules/designRules.js`, `src/rules/motionRules.js`, `src/scanners/metadataScanner.js`.

7. **`ux-ui-agent-skills` (`plugin87/ux-ui-agent-skills`)**
   - **Role**: Multi-Agent Design System, Tokens & Taste Calibration Matrix.
   - **Key Features**: Design tokens discipline, typography scale, WCAG 2.2 Level AA/AAA accessibility rules, component state matrices, taste calibration dials (1-10), multi-agent guidance (`AGENTS.md` and `SKILL.md`).
   - **Integration Point**: `src/rules/tasteCalibration.js`, `src/rules/tokenRules.js`, `SKILL.md`, `AGENTS.md`.

---

## Component Architecture

```
src/
├── cli.js                     [CLI entry point registering all subcommands]
├── commands/
│   ├── audit.js              [Audit design docs, readiness, and gates]
│   ├── autopilot.js          [Autopilot fix list generator]
│   ├── doctor.js             [System & environment health check]
│   ├── init.js               [Scaffold design & product artifacts]
│   ├── loop.js               [NEW: Loop engineering CLI runner]
│   ├── repair.js             [Source, prose, & UI feel auto-repair]
│   ├── report.js             [Generate markdown / JSON audit reports]
│   ├── review.js             [NEW: UI review loop & recording server]
│   ├── scan.js               [Unified source, prose, feel, a11y scanner]
│   ├── standards.js          [Inspect unslop quality standards]
│   └── update.js             [Check & update unslop CLI]
├── core/
│   ├── autopilotPlan.js      [Autopilot plan generator]
│   ├── loopGate.js           [NEW: Loop gate policy validator]
│   ├── loopState.js          [NEW: Loop state & budget manager]
│   ├── report.js             [Report synthesis engine]
│   ├── reviewRecorder.js     [NEW: UI review recorder & server core]
│   └── sourceScanner.js      [Source AST & pattern scanner]
├── rules/
│   ├── accessibilityRules.js [WCAG 2.2 & ARIA rules]
│   ├── designRules.js        [Design tokens & UI layout rules]
│   ├── interfaceFeelRules.js [NEW: 19 polish principles rules]
│   ├── motionRules.js        [NEW: Motion performance rules]
│   ├── proseSlopRules.js     [NEW: Copy & prose slop rules]
│   ├── tasteCalibration.js   [NEW: Taste dials & aesthetic rules]
│   └── tokenRules.js         [NEW: Design tokens governance]
└── scanners/
    ├── browserAutomation.js  [NEW: Headless browser automation]
    ├── interfaceFeelScanner.js [NEW: UI polish AST & CSS scanner]
    ├── proseScanner.js       [NEW: Prose & UI copy slop scanner]
    ├── sourceScanner.js      [Source code pattern scanner]
    └── viewportFit.js        [Viewport & layout overflow scanner]
```

---

## Verification Plan

### Automated Tests
- `bun test`: Run complete suite of unit & integration tests covering all commands, rules, and scanners.
- `node --check bin/cli.js`: Verify syntax validity of all entry points.
- `unslop scan`: Run unslop preflight scan on itself.
- `unslop loop doctor`: Verify loop engine diagnostics.
- `unslop repair`: Test auto-repair pipelines on sample test fixtures.

---
