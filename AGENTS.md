# AGENTS.md

This repository is a quality gate for AI-assisted frontend work. Keep every change narrow, reviewable, and tied to the project goal: producing clearer PRODUCT.md and DESIGN.md artifacts before implementation.

## Working rules for AI coding agents

- Prefer one focused file change per commit unless a test or documentation file must move with it.
- Do not rewrite broad areas of the codebase while fixing a narrow issue.
- Preserve the existing CLI contract, especially `vibe-design-md-architect` and `vdma` commands.
- Keep generated PRODUCT.md and DESIGN.md guidance specific, practical, and implementation-ready.
- Treat accessibility, responsive behavior, privacy, RTL support, and design-token discipline as hard requirements, not optional polish.
- Add or update tests when behavior changes.
- Run `npm test` before proposing or merging a code change when the local environment allows it.

## Repository map

- `bin/` contains CLI entrypoints.
- `src/` contains the core CLI behavior, rules, templates, scanners, and scoring logic.
- `scripts/` contains standalone validators and scanners.
- `tests/` contains Node test runner coverage.
- `references/`, `assets/`, `evals/`, and root markdown files support publishing, examples, and documentation.

## Safe-change policy

Before editing, inspect the smallest relevant file first. After editing, summarize the exact behavior change, the files touched, and any test command run. If you cannot run tests, say why clearly.
