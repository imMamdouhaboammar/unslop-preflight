# Install Agent Harness

The Install Agent Harness gate helps vibe coders choose a small, relevant set of agent skills and developer tools before implementation.

The goal is not to add everything. The goal is to inspect the project, identify the current risk, and recommend only the missing harness items that matter now.

This guide documents the reasoning model. The audit should not install anything by itself.

## Required agent behavior

Before coding, the agent should produce a harness inventory:

- Host: Claude Code, Codex, Cursor, Gemini CLI, Copilot, Antigravity, OpenCode, Windsurf, or another compatible host.
- Project shape: static page, React app, Next app, dashboard, design-system work, migration, refactor, or bug fix.
- Risk profile: runtime errors, duplicate code, missing tests, weak design spec, large-codebase navigation, UI quality, or external app integration.
- Recommendation: required now, recommended now, optional later, or skip.
- Reason: why this item matters for this project now.
- Verification: version check, dry run, source review, restart note, and rollback note where applicable.

## Context overhead rule

Do not bulk-add every skill. Each added skill can increase context overhead, introduce conflicting guidance, and expand the review surface.

Add only what the project needs now.

The agent should explicitly say why an item is not needed yet when it would add noise.

## Required output shape

Each recommendation should include:

| Field | Meaning |
|-------|---------|
| Priority | required now, recommended now, optional later, or skip |
| Harness item | Name or category of the skill, plugin, scanner, runtime helper, or CLI tool |
| Why now | The project-specific risk it solves |
| Setup method | Command or manual setup step after source review |
| Verification | How the user confirms it works |
| Skip condition | When the user should avoid installing it |

Example shape:

```text
Priority: required now
Harness item: React runtime safety helper
Why now: This is a React app with modal and error-prone component flows.
Setup method: Add only after checking package compatibility.
Verification: Run tests and trigger an error boundary case.
Skip condition: Skip if the project is not React or already has error boundaries.
```

## Harness categories

### 1. Agent skill guidance

Use when the project needs reusable instructions for a coding agent.

Good fit:

- recurring frontend quality behavior
- design taste guidance
- repo-specific agent rules
- global habits that should apply across projects

Avoid when:

- the skill only applies to one small task
- the host does not support the skill format
- the skill duplicates rules already present in `AGENTS.md`

### 2. Design and taste harness

Use when the project is UI-heavy or the agent is producing generic design.

Good fit:

- weak `DESIGN.md`
- generic AI visual output
- missing design system baseline
- unclear visual density or motion rules
- landing pages, dashboards, product UI, and redesign work

Avoid when:

- the project already has a mature design system
- the user only needs backend or data work

### 3. Code review and repository understanding harness

Use when the project is large, unfamiliar, or undergoing migration or refactor work.

Good fit:

- large repositories
- many folders or unclear architecture
- refactors
- duplicate code risk
- code review before merge
- migration to a new architecture

Avoid when:

- the project is a small static page
- the issue is isolated and already diagnosed

### 4. React runtime harness

Use when the project is React, Next, Vite, Remix, or component-heavy.

Good fit:

- runtime UI failures
- component crashes
- missing error boundaries
- hydration, rendering, or state bugs
- modal/drawer/page-level error handling

Avoid when:

- the project is not React-based
- runtime safety already exists and is tested

### 5. Planning and research harness

Use when the task is broad, strategic, or multi-file.

Good fit:

- feature planning
- product discovery
- multi-step migrations
- research before implementation
- file-based planning
- requirements extraction

Avoid when:

- the task is a small bug fix
- the spec is already precise and implementation-ready

### 6. External app and MCP harness

Use only when the task needs real actions in third-party tools.

Good fit:

- Workspace automation
- issue trackers
- document generation
- email or Slack workflows
- CRM or project-management operations

Avoid when:

- the task only needs local code edits
- the user has not approved external access
- the connector adds security or privacy risk without clear benefit

### 7. Duplication and code smell harness

Use when the project is growing quickly or has repeated patterns.

Good fit:

- duplicate components
- copied layout sections
- similar hooks or utilities
- UI fragments repeated across pages
- pre-refactor scans

Avoid when:

- the codebase is too small for duplication analysis
- the task is exploratory and not ready for cleanup

### 8. Search and research skill harness

Use when implementation depends on current docs, libraries, APIs, platform behavior, or niche references.

Good fit:

- unfamiliar dependencies
- current framework behavior
- library-specific setup
- competitor or product research
- standards research

Avoid when:

- the answer is already in the repo
- the user explicitly does not want external research

## Priority model

Use this priority model:

| Priority | Meaning |
|----------|---------|
| required now | The task is risky without this harness |
| recommended now | It will materially improve quality, but work can start without it |
| optional later | Useful after the current milestone |
| skip | Adds more noise than value for this project |

A good recommendation is narrow. It should usually include one to three items, not a shopping list.

## Safety notes

- Review third-party repositories before adding them.
- Prefer official, maintained, or widely used sources.
- Do not use global setup when project-local setup is enough.
- Do not add every skill collection because it exists.
- Restart the agent after adding skills when the host requires it.
- Re-run the audit after adding selected harness items.
- Record why each item was installed so the next agent understands the setup.

## Related rules

- `install-agent-harness-missing`
- `agent-harness-bulk-install-guard-missing`
- `agent-harness-priority-matrix-missing`
- `agent-harness-trust-note-missing`
- `react-harness-recommendation-missing`
- `code-review-harness-recommendation-missing`
