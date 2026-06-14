# Install Agent Harness

The Install Agent Harness gate helps vibe coders choose a small, relevant set of agent skills and developer tools before implementation.

The goal is not to add everything. The goal is to inspect the project, identify the current risk, and recommend only the missing harness items that matter now.

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

## Suggested harness categories

### Agent skill guidance

Use when the project needs reusable agent instructions. Prefer project-local guidance when the skill applies only to one repo. Prefer global guidance only when the same behavior is needed across projects.

### Design and taste harness

Use when the project is UI-heavy or the agent is producing generic design. Examples include taste guidance, DESIGN.md references, UI quality constraints, and anti-slop checks.

### Code review and repository understanding harness

Use when the project is large, unfamiliar, or undergoing migration or refactor work. Examples include repository graph review, duplicate-code detection, architecture review, and code-review agents.

### React runtime harness

Use when the project is React, Next, Vite, or component-heavy. Examples include runtime error boundaries, React health checks, and UI smoke tests.

### Planning and research harness

Use when the task is broad, strategic, or multi-file. Examples include planning skills, research skills, product-management skills, and file-based planning.

### External app and MCP harness

Use only when the task needs real actions in third-party tools. Examples include Workspace automation, issue trackers, documents, email, Slack, or app connectors.

## Required output shape

Each recommendation should include:

- Priority: required now, recommended now, optional later, or skip.
- Harness item.
- Why now.
- Setup method or command after source review.
- Verification.
- Skip condition.

## Safety notes

- Review third-party repositories before adding them.
- Prefer official, maintained, or widely used sources.
- Do not use global setup when project-local setup is enough.
- Restart the agent after adding skills when the host requires it.
- Re-run the audit after adding selected harness items.
