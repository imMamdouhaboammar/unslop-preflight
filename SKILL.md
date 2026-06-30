---
name: unslop-preflight
description: Preflight AI-assisted frontend work by creating, auditing, repairing, and scoring PRODUCT.md, DESIGN.md, AGENTS.md, and source code before implementation. Use for UI readiness, design handoff, source slop detection, root-cause diagnosis, accessibility, overlays, responsive behavior, agent instructions, and fix-list generation.
---

# Unslop Preflight

## What this skill does

Use this skill before an AI coding agent starts frontend implementation.

Unslop Preflight turns a vague product or UI request into a safer implementation handoff. It helps the agent create and audit:

- `PRODUCT.md` for product context and constraints
- `DESIGN.md` for implementation-facing design decisions
- `AGENTS.md` for repository-specific agent instructions
- source scan findings for UI, accessibility, responsive, overlay, and source slop risks
- `.unslop/` reports and fix lists when the CLI is available

The goal is to stop generic, fragile, or under-specified frontend work before it becomes code.

## When to use this skill

Use it for:

- SaaS dashboards and admin panels
- landing pages and product pages
- Arabic, RTL, bilingual, or localization-sensitive interfaces
- UI redesigns that feel generic or AI-generated
- frontend repositories that need readiness checks before agent implementation
- modal, drawer, dropdown, tooltip, toast, z-index, overflow, or viewport failures
- projects where `PRODUCT.md`, `DESIGN.md`, or `AGENTS.md` is missing, weak, stale, or filled with placeholders
- vibe-coded projects that need a clearer AI-agent handoff

Do not use it for backend-only tasks, database-only tasks, non-UI scripts, or mature repositories where frontend governance is already fully defined.

## Primary workflow

When a user asks for frontend implementation, UI repair, UI audit, design-system preparation, or agent-readiness work:

1. Identify the project mode.
2. Inspect existing `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, `README.md`, `package.json`, and frontend source directories when file access exists.
3. Extract useful context before asking questions.
4. Create or repair missing handoff artifacts.
5. Run Unslop CLI commands when available and appropriate.
6. Report the readiness band, blockers, fix list, and next action.
7. Do not proceed to broad frontend implementation while readiness is `blocked` or `needs-spec-work`.

## Project modes

Classify the request as one of these modes:

| Mode | Use when |
|------|----------|
| `fresh-seed` | No trustworthy product or design handoff exists yet |
| `existing-scan` | A repository exists and needs audit or source scanning |
| `redesign` | Existing UI feels generic, inconsistent, fragile, or AI-made |
| `implementation` | Handoff artifacts exist and the user wants code changes |
| `audit` | The user wants a quality review or readiness decision |
| `repair` | The user wants safe artifact fixes without broad rewrites |
| `root-cause-fix` | The user reports broken UI, clipping, z-index, overflow, modal, or layout failure |
| `harness-readiness` | The user wants to choose only the agent skills and tools needed now |

If the mode is unclear, infer it and state the assumption briefly.

## Artifact contracts

### PRODUCT.md

`PRODUCT.md` is product and strategy context. It should include:

- product name and category
- core users
- user situation
- primary job to be done
- product promise
- emotional register
- brand traits
- UX risks
- accessibility needs
- localization needs
- writing tone
- anti-references
- success criteria
- assumptions

Do not put detailed component styling, colors, shadows, spacing scales, or z-index rules in `PRODUCT.md`.

### DESIGN.md

`DESIGN.md` is the implementation-facing design contract. It should include:

- Design Read
- Taste Controls
- Design System Decision
- visual direction
- color tokens
- typography scale
- spacing and density rules
- component contracts
- responsive behavior
- accessibility rules
- directionality rules
- modal viewport contract
- overlay and feedback rules
- stacking and z-index reasoning
- popup positioning strategy
- sensitive data display rules
- Root Cause Mode rules
- source scan expectations
- agent handoff
- pre-flight check

A `DESIGN.md` that only says modern, clean, minimal, premium, SaaS-like, or AI-powered is not implementation-ready.

### AGENTS.md

`AGENTS.md` tells coding agents how to work in the repository. It should include:

- change-size policy
- files to read before coding
- commands to run
- testing expectations
- product and design constraints to preserve
- accessibility and privacy requirements
- readiness rules
- Root Cause Mode sequence
- fix-list handling

Prefer `AGENTS.md` for new projects. Respect existing `AGENT.md` only for backward compatibility.

## Readiness bands

Always produce a readiness decision:

| Readiness | Meaning | Action |
|-----------|---------|--------|
| `blocked` | Critical blockers remain | Do not implement yet |
| `needs-spec-work` | Handoff exists but is too vague | Repair or rewrite docs first |
| `agent-ready-with-fix-list` | Mostly ready, but fixes remain | Apply the fix list, then rerun |
| `agent-ready` | Handoff is specific enough | Proceed with normal verification |

## Source slop detectors

When source code exists, scan for risks such as:

- unstable React keys based on `Math.random()` or `Date.now()`
- reorder-prone index keys
- removed focus styles without visible keyboard replacement
- icon-only buttons that need accessible names
- images without sizing contracts
- `target="_blank"` links missing `noopener` or `noreferrer`
- email, password, tel, or search inputs without autocomplete behavior
- motion without reduced-motion handling
- collection rendering without empty states
- async views without loading, error, and empty states
- hardcoded colors outside token or theme files
- generic gradient, glass, and heavy-shadow visual stacks
- broad `transition-all` usage
- sample content, placeholder copy, or dummy domains in source

Source issues that cannot be safely auto-fixed should be written to a fix list for the coding agent.

## Modular Standards Packs (Profiles)

For high-governance projects, you can opt-in to strict, profile-based engineering standard checks (such as `--standards=vibe-coding` to enforce strict component layering, TypeScript types, modularity limits, centralized storage, and credentials scanning).

## Root Cause Mode

When a request mentions a bug, issue, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, or layout failure, diagnose before editing.

Required sequence:

1. Reproduce or restate the failing state.
2. Separate visible symptoms from the underlying cause.
3. Identify the smallest root fix.
4. Check nearby regressions.
5. Provide verification proof.

Do not accept quick fixes, magic numbers, blind `z-9999`, forced dimensions, or broad rewrites without diagnosis.

## Overlay and viewport governance

When `DESIGN.md` mentions modals, dialogs, popups, drawers, sheets, overlays, lightboxes, popovers, toasts, or command palettes, require:

- viewport contract
- width guard
- height guard
- internal scroll behavior
- mobile behavior
- focus behavior
- portal policy when relevant
- QA proof for small viewports, landscape, keyboard-open state, clipping, and horizontal overflow

## Install Agent Harness

Before recommending extra tools or skills, inspect the project. Recommend only what is needed now.

Required output:

- active host, such as Claude Code, Codex, Cursor, Gemini CLI, Copilot, Antigravity, OpenCode, Windsurf, or another host
- project shape
- risk profile
- recommendation priority: required now, recommended now, optional later, or skip
- reason each item matters for this project now
- setup method after source review
- verification and rollback notes

Do not bulk-install every skill or tool.

## Autopilot Hardening and Execution

The primary direct command is `npx unslop-preflight autopilot`. Once installed, `unslop` is available as a shorter binary alias (e.g., `unslop autopilot`).

`autopilot` runs in two modes:
1. **Preflight loop**: Scans, scores, repairs safe handoff docs, and creates fix-lists.
2. **Safe repair loop**: With `--safe-fix`, applies deterministic low-risk source patches and verifies them.

### Repair Modes:
- `--plan-only`: Scan and report only. Writes no files.
- `--doc-fix` (Default): Apply safe `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` repairs only.
- `--safe-fix`: Apply safe doc repairs and safe deterministic source-code fixes.
- `--agent-fix`: Do not modify source directly. Instead generate a stronger coding-agent patch prompt in `.unslop/agent-fix-prompt.md`.

### Verification Loop:
- With `--verify`, Unslop automatically detects your project's lockfile/package manager (`npm`, `pnpm`, `yarn`, `bun`), extracts available build-time checks from `package.json` (like `typecheck`, `lint`, `test`, `build`), and runs them synchronously under a configurable timeout (`--verify-timeout=120`).

### Key hardiness features:
- **Max Passes (`--max-passes=N`)**: Specifies the maximum refinement passes (1-10, default 1) to run, allowing progressive safe repairs.
- **Run Metadata**: Output reports inside `.unslop/` include `beforeAfter` tracking, `verificationResults[]` status, `stopReason` (`agent-ready`, `no-safe-repairs`, `no-score-improvement`, `max-passes`, or `error`), `passes[]` history, and detailed `scanStats`.
- **Scanner Failure Collection**: File walk and scanner-specific crashes do not crash the autopilot run; they are logged as warning metadata. In `--strict` mode, scanner failures are treated as blocking evidence.

## Recommended commands

When the Unslop CLI is available, use these commands:

```bash
npx unslop-preflight init
npx unslop-preflight autopilot --plan-only --report
npx unslop-preflight autopilot --doc-fix --report
npx unslop-preflight autopilot --safe-fix --verify --report --strict
npx unslop-preflight autopilot --agent-fix --report
```

For repository tests:

```bash
npm test
node --test tests/sourceRepair.test.js
```

Do not run commands that make destructive changes unless the user asked for implementation or repair.

## Reporting contract

A useful report should include:

- readiness band
- score when available
- blocker list
- category breakdown
- safe repair summary
- source findings
- fix list
- exact next command
- exact files the coding agent must read next

The report should tell the user whether implementation is allowed, not only list warnings.

## Safety and scope

This skill must not hide risks, bypass security checks, exfiltrate secrets, install unrelated tools, or weaken existing project safeguards. It should preserve useful user decisions and avoid broad rewrites unless explicitly requested.

## Skills.sh install

Install from Skills.sh-compatible GitHub source:

```bash
npx skills add imMamdouhaboammar/unslop-preflight
```

The repository should keep this root `SKILL.md`, `README.md`, and `skills.sh.json` synchronized when behavior changes.
