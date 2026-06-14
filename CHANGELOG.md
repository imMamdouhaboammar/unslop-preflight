# Changelog

## v1.9.7 - Visual Slop Gates (2026-06-14)

### Added

- **Modal scrollbar treatment gate.** Long overlays must remain scrollable without exposing a heavy native scrollbar on the modal shell.
- **Modal shell scrollbar risk warning.** `DESIGN.md` now flags shell-level scrollbar language unless the design defines a restrained body-pane scroll treatment.
- **Typography governance.** New rules require a type scale, hierarchy roles, responsive caps for oversized headings, line-height guidance, and RTL/Arabic typography handling.
- **Typography guide.** Added `docs/TYPOGRAPHY_GATES.md`.
- **Visual slop smoke tests.** Added focused tests for modal scrollbar and typography gates.

### Why it matters

AI coding agents often produce modal forms with ugly exposed scrollbars and random headline sizes. This release blocks those patterns at the design artifact stage before implementation.

## v1.9.6 - Install Agent Harness Gate (2026-06-14)

### Added

- **Install Agent Harness readiness.** The audit system now checks whether the agent handoff asks the coding agent to inspect the project and recommend only the missing skills, tools, and harnesses needed for the current work.
- **Bulk-install guard.** Harness guidance must warn against installing every available skill or tool because unnecessary global context can slow or confuse AI coding agents.
- **Priority matrix requirement.** Harness recommendations should explain priority, project-specific reason, when to use the item, and when to skip it.
- **Trust and verification notes.** Harness guidance should include source review, version checks, dry runs, restart notes, and rollback guidance where relevant.
- **Harness catalog guide.** Added `docs/INSTALL_AGENT_HARNESS.md` to explain how to classify design, review, planning, research, runtime, and external-app harnesses.

### Why it matters

Many VDMA users are vibe coders who do not know which agent skills, scanners, plugins, and runtime helpers are worth installing. This gate turns setup into a project-specific recommendation step instead of a bulk-install habit.

## v1.9.5 - Root Cause Mode Gates (2026-06-13)

### Added

- **Root Cause Mode.** Bug, issue, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, and layout failure language now triggers diagnosis-first governance.
- **Patch-language blocker.** Quick fixes, workarounds, magic numbers, `z-9999`, and `z-index: 9999` are blocked when used without root cause analysis.
- **Verification proof rule.** Root fixes now require proof such as tests, audit output, viewport cases, state cases, or acceptance criteria.
- **Root Cause Mode guide.** Added `docs/ROOT_CAUSE_MODE.md`.

### Why it matters

This release encodes the practical prompt pattern "fix the problem from the root" into the audit system. The agent must diagnose the cause before editing instead of patching visible symptoms.

## v1.9.4 - Modal Viewport and Stacking Reasoning Gates (2026-06-13)

### Added

- **Strict modal viewport gates.** `DESIGN.md` now fails with errors when modals, dialogs, popups, drawers, sheets, popovers, overlays, lightboxes, command palettes, or toasts are mentioned without a viewport contract.
- **Overlay sizing requirements.** Overlays now require explicit width guards, height guards, internal scroll behavior, mobile behavior, and viewport QA proof.
- **Stacking reasoning gate.** Layered UI such as modals, drawers, dropdowns, tooltips, toasts, sticky headers, and fixed headers now requires a stacking or placement plan before implementation.
- **High layer value guard.** Raising layer values without a diagnosis is treated as a design risk instead of an acceptable fix.

### Why it matters

This release targets a repeated AI implementation failure: popups and modals that overflow the viewport, get clipped by parents, appear under headers, or are patched with arbitrary high layer values. The system now blocks those issues at the design artifact stage before a coding agent touches frontend code.

## v1.9.3 - AI Agent Readiness, Taste Calibration, and AGENTS.md (2026-06-13)

### Added

- **AGENTS.md as the primary agent guidance file.** `init`, `audit`, `repair`, reports, templates, and package publishing now understand `AGENTS.md` while preserving compatibility with existing `AGENT.md` files.
- **AI agent readiness bands.** Audit output now translates scores into practical decisions:
  - `blocked`
  - `needs-spec-work`
  - `agent-ready-with-fix-list`
  - `agent-ready`
- **Category breakdowns.** Reports now explain where the risk lives instead of showing only a raw score. Categories include product clarity, design contract, taste calibration, placeholders, accessibility, responsive behavior, security, and agent guidance.
- **Taste calibration rules.** New `src/rules/taste.js` checks for:
  - Design Read
  - Taste Controls
  - dial values from 1 to 10
  - Design System Decision
  - default AI aesthetic risk
  - Pre-flight Check
- **Placeholder gates.** New placeholder detection blocks unresolved template markers in `PRODUCT.md` and `DESIGN.md`, including `[audience]`, `[Feature 1]`, `TODO`, `TBD`, and ellipsis-only placeholders.
- **Updated generated templates.** New projects now start with `Design Read`, `Taste Controls`, `Design System Decision`, `Anti-AI-Slop Guidelines`, `Agent Handoff`, and `Pre-flight Check` sections.
- **Agent-ready reports.** `.vibe-design/report.md` and fix-list output now include readiness, category breakdown, and instructions to read `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` before implementation.
- **Documentation for the readiness system.** Added `docs/AI_AGENT_READINESS.md` as the technical guide for readiness bands, taste rules, placeholder blocking, and report behavior.

### Changed

- `AGENTS.md` is now preferred for new projects.
- Existing `AGENT.md` files are still respected for backward compatibility.
- `repair` now creates or updates the active agent guidance file correctly instead of always targeting `AGENT.md`.
- README, SKILL.md, CONTRIBUTING.md, skills.sh metadata, and repository agent instructions were updated to describe the new behavior.
- `package.json` now includes `AGENTS.md` and `docs/` in the published package files.

### Why it matters

This release moves the system from a checklist-only design gate to an AI-agent readiness layer. VDMA now checks whether the design artifacts are specific enough for a coding agent, whether the visual direction has real taste constraints, and whether unresolved placeholders would cause the agent to invent missing product decisions.

### Migration notes

- No breaking change for users with `AGENT.md`; the system still detects it.
