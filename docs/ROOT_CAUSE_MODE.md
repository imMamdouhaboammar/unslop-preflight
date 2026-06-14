# Root Cause Mode

Root Cause Mode turns the phrase "fix the problem from the root" into an enforceable design handoff rule.

AI coding agents often patch visible symptoms: raising z-index, forcing dimensions, adding overflow hidden, adding delays, or rewriting broad sections. These patches can hide the failure while leaving the cause intact.

VDMA blocks that pattern when the handoff clearly describes a bug, broken UI, layout failure, viewport issue, overlay issue, clipping, z-index conflict, focus trap, or regression.

## When it triggers

Root Cause Mode should trigger when the work mentions:

- bug
- issue
- broken UI
- regression
- overflow
- clipping
- z-index
- viewport
- modal
- popup
- drawer
- dropdown
- tooltip
- toast
- focus trap
- layout failure

The point is not to slow down every task. The point is to stop the agent from applying a symptom patch when the task clearly needs diagnosis.

## Required sequence

When Root Cause Mode applies, the agent must:

1. Reproduce or restate the failing state.
2. Separate visible symptoms from the underlying cause.
3. Identify the smallest root fix.
4. Check nearby regressions.
5. Provide verification proof.

## What counts as root cause analysis

A useful diagnosis should include:

- failing condition
- expected condition
- suspected cause
- confirmed cause
- smallest fix
- regression area
- verification method

Weak:

```text
The modal is behind the header, so increase z-index.
```

Stronger:

```text
The modal is rendered inside a transformed layout wrapper, so its stacking context cannot beat the sticky header. Move the modal to the overlay root and use the project modal layer token. Verify header, drawer, mobile, and keyboard-open states.
```

## Blocked patterns

The audit blocks handoffs that use patch language without diagnosis, including:

- quick fix
- workaround
- temporary fix
- hack
- just increase
- just raise
- z-index: 9999
- z-9999
- magic number
- force the height
- add overflow hidden

These phrases are not always wrong. They become wrong when used without a root-cause explanation and verification proof.

## Verification proof

A root fix needs proof. Acceptable proof includes:

- regression test
- audit output
- viewport scenario
- state scenario
- accessibility check
- keyboard navigation check
- screen-size matrix
- acceptance criteria

For overlay problems, verification should cover small mobile, landscape, keyboard-open state, no clipping, no horizontal overflow, portal policy, and layer conflicts.

## Relationship to overlay gates

Root Cause Mode decides how the agent thinks. Overlay and stacking gates decide what the design must specify.

Use both when a task involves modals, popups, drawers, dropdowns, tooltips, toasts, z-index, clipping, or viewport behavior.

Read [`OVERLAY_LAYERING_GATES.md`](./OVERLAY_LAYERING_GATES.md) for the specific viewport, stacking, portal, and conflict-matrix requirements.

## Related rules

- `root-cause-mode-missing`
- `symptom-patch-language`
- `root-cause-verification-missing`
