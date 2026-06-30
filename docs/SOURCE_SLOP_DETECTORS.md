# Source Slop Detectors

Run source scanning with the package-name command:

```bash
npx unslop-preflight scan src
```

Run source scanning through autopilot:

```bash
npx unslop-preflight autopilot
```

Skip source scanning:

```bash
npx unslop-preflight autopilot --no-source-scan
```

## Scanner metadata

Scanner results are recorded in reports:

```json
{
  "scanner": "accessibility",
  "status": "ok|failed|skipped",
  "durationMs": 12,
  "error": "safe message"
}
```

Reports also include `scanStats` with files scanned, skipped targets, findings, scanner failures, duration, scanners run, and scanners skipped.

## Practical use

Use source slop detectors before implementation handoff. They are a preflight signal, not a replacement for tests, browser QA, or accessibility review.
