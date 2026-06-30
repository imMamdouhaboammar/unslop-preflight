---
name: unslop-preflight
description: Preflight AI-assisted frontend work by creating, auditing, repairing, and scoring PRODUCT.md, DESIGN.md, AGENTS.md, and source code before implementation handoff.
---

# Unslop Preflight

Use this skill before frontend implementation work that depends on AI agents or weak handoff files.

## Primary command

Use the package-name command for direct npx runs:

```bash
npx unslop-preflight autopilot
```

The package name is `unslop-preflight`. The shorter `unslop` name is only a bin alias after local or global install.

## What the CLI checks

- `PRODUCT.md` product context
- `DESIGN.md` design contract
- `AGENTS.md` agent guidance
- frontend source scanner findings
- `.unslop/` reports and fix lists

## Autopilot behavior

Autopilot runs artifact audit, optional source scanning, safe documentation repair, final audit, report writing, and readiness scoring.

`--max-passes=N` runs up to `N` passes. Reports include pass history and stop reason.

Autopilot applies safe documentation repairs only. It does not rewrite source files.

## Source scanner behavior

Scanner failures must be reported in `.unslop/report.json` and `.unslop/report.md`. Non-strict mode treats scanner failures as warnings. Strict mode treats them as blocking evidence.

## Code fix flag

`--apply-code-fixes` is kept for compatibility. Source patching is not implemented yet. Reports should record `requested: true`, `applied: false`, and `reason: not-implemented` when the flag is used.

## Recommended commands

```bash
npx unslop-preflight autopilot --max-passes=3
npx unslop-preflight scan src --strict
npm test
npm run build
npm run pack:dry-run
```

After local install only, the package bin alias may be used:

```bash
npm install --save-dev unslop-preflight
```

## Readiness bands

| Readiness | Meaning |
|-----------|---------|
| `blocked` | Critical blockers remain |
| `needs-spec-work` | Handoff exists but is too vague |
| `agent-ready-with-fix-list` | Mostly ready with fixes attached |
| `agent-ready` | Ready for normal verification |

## Reporting contract

A useful report should include readiness band, score, blockers, category breakdown, scan stats, scanner failures, safe repairs, source findings, pass history, stop reason, fix list, and exact report paths.

## Safety and scope

Do not hide risks, weaken existing safeguards, or imply source files were changed when only documentation repairs were applied.
