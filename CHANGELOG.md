# Changelog

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
- New projects should use `AGENTS.md`.
- If audit output reports `blocked` or `needs-spec-work`, update `PRODUCT.md`, `DESIGN.md`, or `AGENTS.md` before handing the project to a coding agent.

## v1.9.0 - 10-Point Production Rewrite (2026-06-10)

### Added

- Modular `src/` architecture with separated rules, commands, templates, and reporting.
- Strict anti-AI-slop rules for generic icon language, fake content, hardcoded design choices, and weak visual defaults.
- Idempotent repair markers to avoid duplicate injected sections.
- Deterministic contrast math for WCAG checks.
- `doctor` command for runtime and project assumptions.
- `--agent-prompt` output mode for writing fix lists into `.vibe-design/fix-list.md`.
- Cleaner CLI output with JSON-safe logging behavior.

## v1.8.0 - Agentic Autopilot Loop (2026-06-08)

### Added

- `npx vdma autopilot` as the main one-command loop.
- Multi-pass repair flow for `PRODUCT.md` and `DESIGN.md`.
- `VDMA-FIXES.md` for source code issues that require an agent or human to fix.
- `npx vdma repair` command.
- Autopilot options: `--max-passes`, `--no-source-scan`, `--no-impeccable`, and `--dry-run`.

## v1.7.0 - Popup Positioning and Directionality Hardening (2026-06-08)

### Added

- Gate 23: Popup and Floating Element Positioning.
- Strategy A/B/C positioning declaration for floating UI.
- Portal mounting rule for elements that need to escape clipping parents.
- Z-index token scale for dropdowns, tooltips, modals, and toasts.

### Changed

- Directionality is now conditional. LTR remains the default unless intake confirms Arabic, Hebrew, or another RTL language.

## v1.6.0 - Dashboard Shell, Overlay Stack, and Sensitive Data Gates (2026-06-03)
