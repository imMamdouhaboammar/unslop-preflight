# AI Agent Readiness System

This document explains the readiness layer in Unslop.

The goal is simple: do not hand a vague product brief, weak design file, or unsafe implementation handoff to an AI coding agent.

VDMA checks whether the project has enough product truth, design judgment, implementation guidance, root-cause discipline, overlay reasoning, setup awareness, and safety constraints before code starts.

## What changed

The system goes beyond the original 23 numbered UI gates.

It adds cross-cutting readiness checks:

1. `AGENTS.md` support
2. readiness bands
3. category breakdowns
4. taste calibration
5. placeholder blocking
6. Root Cause Mode
7. modal viewport and overlay reasoning
8. stacking and z-index reasoning
9. Install Agent Harness readiness

These checks sit above the numbered gates. They are not a replacement for accessibility, responsive, modal, overlay, token, or sensitive-data checks. They make the audit result easier to act on and harder for a coding agent to bypass.

## Active agent guidance file

New projects should use:

```text
AGENTS.md
```

Older projects that already have this file remain supported:

```text
AGENT.md
```

Resolution rule:

1. If `AGENTS.md` exists, use it.
2. If only `AGENT.md` exists, use it for compatibility.
3. If neither exists, create `AGENTS.md`.

The active agent guidance file should tell the coding agent which files to read, how large changes should be, which commands to run, and which design constraints must not be invented or ignored.

## Readiness bands

The audit result should produce a decision band.

| Band | Meaning | Action |
|------|---------|--------|
| `blocked` | Critical blockers remain | Do not implement yet |
| `needs-spec-work` | Docs exist, but they are too vague or incomplete | Repair product/design/agent docs first |
| `agent-ready-with-fix-list` | The handoff is mostly usable, but fixes remain | Apply the fix list, rerun audit |
| `agent-ready` | The artifacts are specific enough for implementation | Proceed with the coding agent |

The readiness band matters more than the raw score. A score can look acceptable while a single unresolved placeholder, security issue, accessibility blocker, missing root-cause diagnosis, or missing overlay contract still blocks implementation.

## Category breakdown

Reports should group issues into practical categories.

Useful categories include:

- product clarity
- design contract
- taste calibration
- placeholders
- agent guidance
- root cause governance
- install agent harness
- accessibility
- responsive behavior
- viewport governance
- modal and overlay governance
- stacking and z-index reasoning
- popup positioning
- sensitive data display
- security and privacy
- implementation scan

The category breakdown answers this question:

```text
What should I fix first?
```

## Taste calibration

Taste calibration prevents the coding agent from defaulting to generic AI UI.

A strong `DESIGN.md` should include these sections.

### Design Read

The Design Read is the agent's short interpretation of the product before it starts designing.

Recommended shape:

```text
Reading this as: [specific product] for [specific user] who needs [specific job] under [specific constraint]. The interface should feel [specific direction], not [anti-reference].
```

This makes weak prompts visible. If the agent cannot write a specific Design Read, the brief is probably not ready.

### Taste Controls

Use three dials from 1 to 10.

| Dial | Meaning |
|------|---------|
| `DESIGN_VARIANCE` | How far the UI can move from default component-system patterns |
| `MOTION_INTENSITY` | How much motion is appropriate for the product and risk level |
| `VISUAL_DENSITY` | How much information the screen can carry |

Examples:

```text
DESIGN_VARIANCE: 3
MOTION_INTENSITY: 2
VISUAL_DENSITY: 8
```

A dense finance dashboard might use high visual density and low motion. A marketing landing page might allow higher variance and more expressive motion.

### Design System Decision

The system should record the baseline:

- Atlassian
- Salesforce Lightning
- Shopify Polaris
- Material Design
- Apple Human Interface
- Custom or hybrid

The decision should explain why the baseline fits. It should not copy another brand's skin.

### Anti-AI-Slop Guidelines

These rules should be product-specific, not generic.

Weak:

```text
Make it premium and modern.
```

Stronger:

```text
Avoid purple-blue gradients, glass cards, sparkle icons, and generic three-card feature grids. Use a quieter institutional dashboard feel with dense but readable tables, clear action hierarchy, and restrained motion.
```

### Agent Handoff

The handoff tells the coding agent what to preserve.

It should include:

- files to read first
- design system baseline
- taste dials
- responsive rules
- accessibility rules
- modal and overlay rules
- root-cause rules
- install-agent-harness recommendations
- sensitive-data rules
- forbidden inventions

### Pre-flight Check

Before implementation, confirm:

- `PRODUCT.md` exists and is specific
- `DESIGN.md` exists and is specific
- `AGENTS.md` or compatible `AGENT.md` exists
- no unresolved placeholders remain
- readiness is not `blocked`
- root-cause requirements are satisfied for bug or broken UI work
- overlay and stacking requirements are satisfied for layered UI work
- selected harness items are explicit and minimal
- fix-list items are known

## Root Cause Mode

Root Cause Mode turns the prompt pattern "fix the problem from the root" into a required handoff rule.

When the work mentions a bug, issue, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, or layout failure, the agent must:

1. Reproduce or restate the failing state.
2. Separate symptoms from the underlying cause.
3. Identify the smallest root fix.
4. Check nearby regressions.
5. Provide verification proof.

The audit blocks symptom-only language such as quick fix, workaround, hack, just increase, just raise, magic number, `z-9999`, and `z-index: 9999` when it appears without diagnosis.

Read [`ROOT_CAUSE_MODE.md`](./ROOT_CAUSE_MODE.md).

## Overlay and stacking readiness

Overlay-heavy UI needs more than a z-index value.

When `DESIGN.md` mentions modals, dialogs, popups, drawers, sheets, popovers, lightboxes, command palettes, dropdowns, tooltips, sticky headers, fixed headers, or toasts, the design should include:

- viewport contract
- width guard
- height guard
- internal scroll behavior
- mobile behavior
- viewport QA proof
- placement plan
- stacking context audit
- layer scale
- portal policy
- conflict matrix

This blocks common AI failures such as modals that overflow mobile screens, dropdowns clipped by overflow parents, tooltips trapped by transformed ancestors, and arbitrary `z-9999` fixes.

Read [`OVERLAY_LAYERING_GATES.md`](./OVERLAY_LAYERING_GATES.md).

## Install Agent Harness readiness

Many users are vibe coders. They may not know what agent skills, plugins, scanners, or runtime helpers should be installed before coding.

The Install Agent Harness gate requires the coding agent to inspect the project and recommend only the missing harness items needed now.

The recommendation should include:

- active host
- project shape
- current risk profile
- priority: required now, recommended now, optional later, or skip
- reason for this project now
- setup method after source review
- verification and rollback notes

Do not bulk-install every skill. Extra skills add context overhead, increase review surface, and can introduce conflicting instructions.

Read [`INSTALL_AGENT_HARNESS.md`](./INSTALL_AGENT_HARNESS.md).

## Placeholder blocking

Placeholders are allowed in starter templates. They are not allowed in implementation handoffs.

Blocked examples:

```text
[audience]
[Feature 1]
[product name]
TODO
TBD
...
```

Why this matters:

- The coding agent will otherwise invent missing product decisions.
- Placeholder text often reaches UI copy, labels, or fake data.
- Placeholder-driven implementation creates false confidence because the app appears complete while the product brief is empty.

## Report behavior

A useful report should show:

```text
Score: 82
Readiness: agent-ready-with-fix-list
Decision: The project can move toward implementation after the listed source fixes are applied.
Top categories:
- overlay governance: 1 blocker
- root cause governance: 1 warning
- accessibility: 2 warnings
```

The report should not merely say pass or fail. It should tell the user what to do next.

## Fix-list behavior

When source code has risky issues, the system should not blindly patch everything.

Instead, it should write a fix list for the coding agent:

```text
Read PRODUCT.md, DESIGN.md, and AGENTS.md. Apply every item below. Do not invent design decisions outside the artifacts. Diagnose the root cause before changing code. Rerun npx unslop audit after applying fixes.
```

This keeps the repair loop safe.

## Compatibility notes

- `AGENTS.md` is preferred.
- `AGENT.md` remains compatible.
- Existing projects should not break only because they use the older filename.
- New generated files should use the readiness sections.

## Recommended user flow

```bash
npx unslop-preflight autopilot
# read score, readiness, categories, and fix list
# repair PRODUCT.md, DESIGN.md, AGENTS.md, or source as needed
npx unslop-preflight autopilot
# proceed only when readiness is agent-ready or intentionally accepted by the team
```

## Documentation sync checklist

When the readiness system changes, update:

- `README.md`
- `CHANGELOG.md`
- `SKILL.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
- this file
- `docs/ROOT_CAUSE_MODE.md`
- `docs/OVERLAY_LAYERING_GATES.md`
- `docs/INSTALL_AGENT_HARNESS.md`
- package metadata if published files change
