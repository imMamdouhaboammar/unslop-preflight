# AGENTS.md

This repository is a quality gate for AI-assisted frontend work. Keep every change narrow, reviewable, and tied to the project goal: producing clearer `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` artifacts before implementation.

## Working rules for AI coding agents

- Prefer one focused file change per commit unless tests or docs must move with the same behavior change.
- Do not rewrite broad areas of the codebase while fixing a narrow issue.
- Preserve the existing CLI contract, especially `vibe-design-md-architect` and `vdma` commands.
- Treat `AGENTS.md` as the preferred agent guidance file for new projects.
- Preserve compatibility with existing `AGENT.md` files.
- Keep generated `PRODUCT.md` and `DESIGN.md` guidance specific, practical, and implementation-ready.
- Treat accessibility, responsive behavior, privacy, RTL support, viewport governance, overlay rules, sensitive-data handling, and design-token discipline as hard requirements.
- Add or update tests when behavior changes.
- Run `npm test` before proposing or merging a code change when the local environment allows it.

## Files to inspect before changing behavior

- `src/core/auditor.js` for scoring, readiness, categories, and artifact loading.
- `src/core/reporter.js` for report and fix-list output.
- `src/core/templates.js` for generated `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` content.
- `src/commands/init.js` and `src/commands/repair.js` for artifact creation and safe repair.
- `src/rules/` for product, design, taste, placeholder, agent, and UX rules.
- `README.md`, `CHANGELOG.md`, `SKILL.md`, `CONTRIBUTING.md`, and `docs/AI_AGENT_READINESS.md` when behavior changes.

## Readiness rules

The audit should produce one of these readiness bands:

- `blocked`
- `needs-spec-work`
- `agent-ready-with-fix-list`
- `agent-ready`

Do not treat a raw score as enough. A single unresolved placeholder, security issue, accessibility blocker, or missing core artifact can still block implementation.

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
- package metadata when published files change
