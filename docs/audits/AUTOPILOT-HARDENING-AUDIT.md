# Autopilot Hardening Audit

This audit captures the current autopilot contract and the hardening work needed to keep it reliable, truthful, and safe to recommend.

## Package and command naming

- Current npm package name: `unslop-preflight`.
- Current bin aliases in `package.json`: `unslop-preflight` and `unslop`.
- Safe direct npx command: `npx unslop-preflight autopilot`.
- The `unslop` alias is safe after local or global installation only:
  - local: `npm install --save-dev unslop-preflight` then `npx unslop autopilot`
  - global: `npm install -g unslop-preflight` then `unslop autopilot`

## Existing autopilot flags

The CLI parser accepts boolean flags and `--key=value` pairs. Autopilot-relevant flags include:

- `--max-passes=N`
- `--no-source-scan`
- `--dry-run`
- `--json`
- `--strict`
- `--ci`
- `--report`
- `--agent-prompt`
- `--apply-code-fixes`

## Multi-pass status

Before this hardening pass, `--max-passes` was documented but the implementation behaved as a single pass. The hardened implementation runs up to `N` passes and stops early when it reaches `agent-ready`, has no safe repairs left, fails to improve the score, reaches max passes, or hits a blocking scanner error.

## Files autopilot writes

Autopilot can write:

- `PRODUCT.md`
- `DESIGN.md`
- `AGENTS.md` or the existing `AGENT.md`
- `.unslop/report.md`
- `.unslop/report.json`
- `.unslop/fix-list.md`

It should not rewrite source code files.

## Safe documentation repairs

Safe doc repairs are limited to known Markdown sections with `unslop:start` and `unslop:end` markers. They cover missing product sections, responsive behavior, interaction states, accessibility notes, security display rules, and agent handoff guidance. Repairs should be idempotent and preserve readable Markdown spacing.

## Code fix application

`--apply-code-fixes` is not a source patcher yet. The truthful behavior is:

```json
{
  "codeFixes": {
    "requested": true,
    "applied": false,
    "reason": "not-implemented"
  }
}
```

Autopilot should warn the user and write fix-list guidance only.

## Source scanner behavior on errors

Before hardening, scanner exceptions were swallowed by empty catch blocks. The hardened behavior records structured scanner metadata:

```json
{
  "scanner": "accessibility",
  "status": "ok|failed|skipped",
  "durationMs": 12,
  "error": "safe message"
}
```

Non-strict runs surface failures as warnings. Strict runs turn scanner failures into blocking evidence.

## Report fields

Reports should separate:

- document audit results
- source scan findings
- safe doc repairs applied
- source code issues that need manual or agent work
- scanner failures
- pass history
- final readiness band
- stop reason
- scan statistics
- code fix request status

## Scan statistics

The hardened report includes best-effort scan stats:

```json
{
  "scanStats": {
    "filesScanned": 0,
    "filesSkipped": 0,
    "findings": 0,
    "scannerFailures": 0,
    "durationMs": 0,
    "scannersRun": [],
    "scannersSkipped": []
  }
}
```

`filesSkipped` is currently best-effort and counts skipped scanner targets rather than every skipped file under ignored folders.

## Current benchmark status

The benchmark report includes failed torture cases. The README should not imply perfect coverage. Unslop is a preflight guard and fix-list generator. It is not a replacement for tests, browser QA, accessibility tooling, or manual review.

## CI coverage gaps

Before hardening, the main CI workflow focused on evals and file presence. It did not run the full local test suite or package dry-run in the main workflow. CI should run `npm ci`, `npm test`, `npm run build`, `npm run pack:dry-run`, and evals.

## Main risks

- Static scanners can miss runtime-only UI issues.
- Scanner failures can create false confidence if not surfaced.
- Documentation repairs can make a repo look cleaner while source issues remain.
- `--apply-code-fixes` can mislead users unless clearly marked as not implemented.
- Benchmark failures must stay visible until the torture cases pass.
