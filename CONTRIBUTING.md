# Contributing to Vibe Design MD Architect

Thank you for improving this project. This repository is a quality gate for AI-assisted frontend work, so every change should keep the system safer, clearer, and easier for coding agents to follow.

## Change-size policy

Keep changes narrow and reviewable.

Prefer one focused behavior change per pull request. A behavior change may include docs and tests in the same PR when they describe or verify the same behavior.

Avoid broad rewrites unless the purpose is explicitly a documentation refresh or a structural cleanup that has been reviewed as such.

## Adding a new gate

Gates are rules that prevent implementation until the design artifacts are strong enough.

### 1. Decide whether it is a numbered gate or readiness-layer rule

Use a numbered gate when the rule belongs to the core UI governance set.

Use a readiness-layer rule when the rule cuts across artifacts, such as:

- readiness bands
- placeholder detection
- taste calibration
- category breakdowns
- agent guidance file resolution
- root-cause governance
- install-agent-harness readiness

Use an overlay or implementation-behavior rule when the gate protects UI behavior such as modal sizing, stacking context, portal policy, viewport behavior, source scans, or collision handling.

Do not force every rule into the numbered gate list.

### 2. Add or update rule code

Rule code lives mainly in `src/rules/`.

Common locations:

- `src/rules/product.js`
- `src/rules/design.js`
- `src/rules/taste.js`
- `src/rules/placeholders.js`
- `src/rules/rootCause.js`
- `src/rules/agentHarness.js`
- `src/rules/modalViewport.js`
- `src/rules/stacking.js`
- `src/rules/agent.js`
- `src/rules/index.js`

Keep checks focused, deterministic, and easy to explain in a report.

A good rule should include:

- stable `id`
- clear `category`
- useful `severity`
- direct `message`
- practical `suggestedFix`
- minimal false positives

### 3. Update templates when the rule requires new artifact content

Generated artifact templates should make the correct behavior easy.

Update the relevant template source when a rule expects new sections in:

- `PRODUCT.md`
- `DESIGN.md`
- `AGENTS.md`

Generated files should not rely on unresolved placeholders for implementation-ready output.

### 4. Update reports when the output changes

If a rule affects scoring, readiness, categories, or fix-list behavior, update the reporter output as well.

Reports should include:

- score
- readiness band
- category breakdown
- blockers
- safe repair summary
- exact next action

### 5. Add or update tests

Add tests when behavior changes.

At minimum, test:

- the failure case
- the passing case
- compatibility with existing files when relevant
- pipeline registration when the rule is exported through `src/rules/index.js`

Use:

```bash
npm test
```

## Updating an existing gate

When changing a gate:

- keep the gate ID stable unless the behavior is intentionally new
- update the rule code
- update `SKILL.md`
- update relevant templates
- update `README.md` if the public behavior changed
- update `CHANGELOG.md`
- update the relevant guide in `docs/`

## Updating AGENTS.md behavior

`AGENTS.md` is the preferred agent guidance file for new projects.

Rules:

- New projects should generate `AGENTS.md`.
- Existing projects with only `AGENT.md` should remain compatible.
- Audit and repair should read the active agent guidance file.
- Reports and fix lists should tell coding agents to read `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` unless compatibility mode is active.
- Agent guidance should include Root Cause Mode and Install Agent Harness behavior when relevant.

## Updating readiness behavior

Readiness changes must stay practical.

The four readiness bands are:

- `blocked`
- `needs-spec-work`
- `agent-ready-with-fix-list`
- `agent-ready`

If you change the logic behind these bands, update:

- `src/core/auditor.js`
- `src/core/reporter.js`
- `README.md`
- `SKILL.md`
- `CHANGELOG.md`
- `docs/AI_AGENT_READINESS.md`

## Updating taste rules

Taste rules should stop generic AI UI without turning the system into personal preference.

Good taste rules check for concrete design decisions:

- Design Read
- Taste Controls
- valid dial values from 1 to 10
- Design System Decision
- product-specific anti-AI-slop instructions
- Agent Handoff
- Pre-flight Check

Avoid vague checks that only enforce words like modern, clean, premium, or minimal.

## Updating Root Cause Mode

Root Cause Mode rules should force diagnosis before patching.

When changing root-cause behavior, update:

- `src/rules/rootCause.js`
- `docs/ROOT_CAUSE_MODE.md`
- `AGENTS.md`
- `SKILL.md`
- `README.md`
- tests for blocked patch language and verification proof

Do not weaken the rule into a generic suggestion. The system should block symptom-only fixes when the task clearly involves a bug, broken UI, overflow, clipping, viewport, z-index, or overlay failure.

## Updating overlay, modal, and stacking gates

Overlay behavior is high-risk because a screenshot can look fine while real viewports break.

When changing overlay or stacking behavior, update:

- `src/rules/modalViewport.js`
- `src/rules/stacking.js`
- `docs/OVERLAY_LAYERING_GATES.md`
- `SKILL.md`
- `README.md`
- tests for missing viewport contract, blind z-index, portal policy, and stacking context audit

Required concepts should stay explicit:

- viewport contract
- width guard
- height guard
- internal scroll
- mobile behavior
- QA proof
- stacking context audit
- layer scale
- portal policy
- conflict matrix

## Updating Install Agent Harness

Harness guidance should recommend a small, project-specific set of skills and tools. It should not encourage bulk install.

When changing harness behavior, update:

- `src/rules/agentHarness.js`
- `docs/INSTALL_AGENT_HARNESS.md`
- `AGENTS.md`
- `SKILL.md`
- `README.md`
- tests for inventory, bulk-install guard, priority matrix, and trust notes

Each recommendation should explain priority, why it matters now, setup method after source review, verification, and skip condition.

## Updating placeholder rules

Placeholder rules should block implementation handoffs that still contain template markers.

Common blocked patterns:

- `[audience]`
- `[Feature 1]`
- `[product name]`
- `TODO`
- `TBD`
- `...`

Be careful not to block legitimate markdown syntax or real product copy.

## Scanner rule changes

Source scanners live in `scripts/`.

When adding a scanner rule, include:

- severity: `blocker` or `warning`
- clear message
- filename and line when possible
- corrective guidance
- test fixture when practical

Source issues that cannot be safely auto-fixed should become fix-list items, not silent rewrites.

## Documentation sync checklist

Any behavior change should update the docs in the same PR.

Check these files:

- [ ] `README.md`
- [ ] `CHANGELOG.md`
- [ ] `SKILL.md`
- [ ] `AGENTS.md`
- [ ] `CONTRIBUTING.md`
- [ ] `docs/AI_AGENT_READINESS.md`
- [ ] `docs/ROOT_CAUSE_MODE.md`
- [ ] `docs/OVERLAY_LAYERING_GATES.md`
- [ ] `docs/INSTALL_AGENT_HARNESS.md`
- [ ] package metadata if published files changed
- [ ] reference files if the rule needs deeper explanation
- [ ] templates if generated artifacts changed

## PR checklist

Before opening or merging a PR, verify:

- [ ] Change is focused and reviewable.
- [ ] Existing CLI contract is preserved unless a breaking change is documented.
- [ ] `AGENTS.md` compatibility behavior is respected.
- [ ] Readiness output still gives a clear next action.
- [ ] Placeholder checks do not block valid content.
- [ ] Taste rules enforce concrete decisions, not personal preference.
- [ ] Root-cause rules block symptom-only fixes but allow diagnosed fixes.
- [ ] Overlay rules require viewport, stacking, and portal reasoning when relevant.
- [ ] Harness rules warn against bulk install and require project-specific priority.
- [ ] Tests were added or updated when behavior changed.
- [ ] `npm test` was run when local environment allowed it.
- [ ] Docs were updated with the behavior change.

## Code style

- Use ES modules.
- Keep runtime dependencies minimal.
- Keep rules deterministic.
- Prefer clear helper functions over dense regex-only logic.
- Do not hide failures behind vague warnings.
- Make output useful to a human and to an AI coding agent.

## Questions

Open an issue with the `question` label or start a discussion.
