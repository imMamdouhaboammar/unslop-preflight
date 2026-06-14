# AGENTS.md

This repository is a quality gate for AI-assisted frontend work. Keep every change narrow, reviewable, and tied to the project goal: producing clearer `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` artifacts before implementation.

## Working rules for AI coding agents

- Prefer one focused file change per commit unless tests or docs must move with the same behavior change.
- Do not rewrite broad areas of the codebase while fixing a narrow issue.
- Preserve the existing CLI contract, especially `vibe-design-md-architect` and `vdma` commands.
- Treat `AGENTS.md` as the preferred agent guidance file for new projects.
- Preserve compatibility with existing `AGENT.md` files.
- Keep generated `PRODUCT.md` and `DESIGN.md` guidance specific, practical, and implementation-ready.
- Treat accessibility, responsive behavior, privacy, RTL support, viewport governance, overlay rules, sensitive-data handling, root-cause diagnosis, install-agent-harness guidance, and design-token discipline as hard requirements.
- Add or update tests when behavior changes.
- Run `npm test` before proposing or merging a code change when the local environment allows it.

## Root Cause Mode

When a request mentions a bug, issue, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, or layout failure, do not patch the symptom first.

Use this sequence before editing code:

1. Reproduce the failure or restate the failing state.
2. Separate visible symptoms from the underlying cause.
3. Identify the smallest root fix that removes the cause.
4. Check nearby regressions that the fix could create.
5. Add verification proof: test, audit output, viewport case, state case, or acceptance criteria.

Do not use quick fixes, magic numbers, `z-9999`, forced dimensions, or broad rewrites unless the root cause analysis proves they are necessary.

## Install Agent Harness

Before handing a project to a coding agent, inspect the project and recommend only the skills or tools it actually needs now.

Use this sequence:

1. Detect the active agent host: Claude Code, Codex, Cursor, Gemini CLI, Copilot, Antigravity, OpenCode, Windsurf, or other compatible host.
2. Inspect project shape: framework, test setup, UI risk, review risk, design-system maturity, runtime error risk, and whether the project is a small page, large app, migration, or refactor.
3. Recommend a small harness inventory with priority: required now, recommended now, optional later, or skip.
4. Explain the job of each recommended item and why it matters for this specific project.
5. Include install command only when the source is trusted and relevant.
6. Include verification: version check, dry run, source review, restart note, and rollback note where applicable.

Tip: This engine can work with many skills and tools. Install only the ones you actually need. Bulk-installing every skill adds unnecessary context overhead for the AI agent on every run and increases the review surface.

## Overlay and stacking reasoning

When working on modals, dialogs, popups, drawers, sheets, overlays, lightboxes, popovers, command palettes, dropdowns, tooltips, toasts, sticky headers, or fixed headers, check the design contract before editing code.

Required concepts:

- viewport contract
- width guard
- height guard
- internal scroll
- mobile behavior
- viewport QA proof
- stacking context audit
- layer scale
- portal policy
- conflict matrix

Do not solve layered UI problems by raising z-index alone.

## Files to inspect before changing behavior

- `src/core/auditor.js` for scoring, readiness, categories, and artifact loading.
- `src/core/reporter.js` for report and fix-list output.
- `src/core/templates.js` for generated `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` content.
- `src/commands/init.js` and `src/commands/repair.js` for artifact creation and safe repair.
- `src/rules/` for product, design, taste, placeholder, root-cause, agent-harness, modal-viewport, stacking, agent, and UX rules.
- `README.md`, `CHANGELOG.md`, `SKILL.md`, `CONTRIBUTING.md`, and `docs/` when behavior changes.

## Readiness rules

The audit should produce one of these readiness bands:

- `blocked`
- `needs-spec-work`
- `agent-ready-with-fix-list`
- `agent-ready`

Do not treat a raw score as enough. A single unresolved placeholder, security issue, accessibility blocker, missing root-cause diagnosis, or missing overlay contract can still block implementation.

## Taste rules

Taste checks should enforce concrete design decisions, not personal preference.

Strong checks include:

- Design Read
- Taste Controls with numeric dials from 1 to 10
- Design System Decision
- product-specific anti-AI-slop guidance
- Agent Handoff
- Pre-flight Check

Do not reward vague phrases such as modern, premium, clean, minimal, or AI-powered unless they are backed by product-specific constraints.

## Placeholder rules

Do not allow implementation handoff files to keep unresolved placeholders such as:

- `[audience]`
- `[Feature 1]`
- `[product name]`
- `TODO`
- `TBD`
- `...`

Placeholders are acceptable in starter templates. They are blockers in final `PRODUCT.md` or `DESIGN.md` handoffs.

## Repository map

- `bin/` contains CLI entrypoints.
- `src/` contains the core CLI behavior, rules, templates, scanners, and scoring logic.
- `scripts/` contains standalone validators and scanners.
- `tests/` contains Node test runner coverage.
- `references/`, `assets/`, `evals/`, and root markdown files support publishing, examples, and documentation.
- `docs/` contains system-level documentation for readiness and agent behavior.

## Safe-change policy

Before editing, inspect the smallest relevant file first. After editing, summarize the exact behavior change, the files touched, and any test command run. If tests cannot run, say why clearly.

## Documentation sync

When behavior changes, update docs in the same change:

- `README.md`
- `CHANGELOG.md`
- `SKILL.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `docs/AI_AGENT_READINESS.md`
- `docs/ROOT_CAUSE_MODE.md`
- `docs/OVERLAY_LAYERING_GATES.md`
- `docs/INSTALL_AGENT_HARNESS.md`
- package metadata when published files change
