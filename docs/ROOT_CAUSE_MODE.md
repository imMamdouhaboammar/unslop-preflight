# Root Cause Mode

Root Cause Mode turns the phrase "fix the problem from the root" into an enforceable design handoff rule.

AI coding agents often patch visible symptoms: raising z-index, forcing dimensions, adding overflow hidden, adding delays, or rewriting broad sections. These patches can hide the failure while leaving the cause intact.

## Required sequence

When the work mentions a bug, issue, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, or layout failure, the agent must:

1. Reproduce or restate the failing state.
2. Separate symptoms from the underlying cause.
3. Identify the smallest root fix.
4. Check nearby regressions.
5. Provide verification proof.

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

## Verification proof

A root fix needs proof. Acceptable proof includes a regression test, audit output, viewport scenario, state scenario, accessibility check, or acceptance criteria that proves the cause was removed.

## Related rules

- `root-cause-mode-missing`
- `symptom-patch-language`
- `root-cause-verification-missing`
