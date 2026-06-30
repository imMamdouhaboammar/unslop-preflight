# Unslop Preflight

The package name is `unslop-preflight`.

Run the direct npx command:

```bash
npx unslop-preflight autopilot
```

Unslop checks `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, and frontend source patterns before implementation handoff.

## Autopilot

Autopilot runs artifact checks, optional source scanning, safe documentation repairs, and report generation.

```bash
npx unslop-preflight autopilot --max-passes=3
npx unslop-preflight autopilot --no-source-scan
npx unslop-preflight autopilot --dry-run
npx unslop-preflight autopilot --json
npx unslop-preflight autopilot --strict
```

`--max-passes=N` runs up to `N` passes. The report includes pass history and a stop reason.

Autopilot applies safe documentation repairs only. It does not rewrite source files.

## Reports

Autopilot writes:

```text
.unslop/report.md
.unslop/report.json
.unslop/fix-list.md
```

The JSON report includes `passes`, `stopReason`, `scanStats`, scanner failures, safe repairs, source findings, and code fix status.

## Source scanning

```bash
npx unslop-preflight scan src
npx unslop-preflight scan src --strict
```

Scanner failures are reported. Strict mode treats scanner failures as blocking evidence.

## Code fix flag

`--apply-code-fixes` is kept for compatibility, but source patching is not implemented yet. Reports record `requested: true`, `applied: false`, and `reason: not-implemented`.

## Benchmark honesty

Unslop is a preflight guard and fix-list generator. It is not a replacement for tests, browser QA, accessibility tooling, or manual review. Known benchmark misses should stay visible until fixed.

## Local install alias

After installing the package in a project, the `unslop` bin alias is available from the local package binary.

```bash
npm install --save-dev unslop-preflight
```

## Documentation

- [`docs/audits/AUTOPILOT-HARDENING-AUDIT.md`](./docs/audits/AUTOPILOT-HARDENING-AUDIT.md)
- [`docs/SOURCE_SLOP_DETECTORS.md`](./docs/SOURCE_SLOP_DETECTORS.md)
- [`docs/AI_AGENT_READINESS.md`](./docs/AI_AGENT_READINESS.md)
- [`SKILL.md`](./SKILL.md)
- [`CHANGELOG.md`](./CHANGELOG.md)
