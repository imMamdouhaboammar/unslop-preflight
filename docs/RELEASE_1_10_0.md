# v1.10.0 Release Notes

This release adds source-level UI quality detectors for frontend code produced by AI coding agents.

## Added

- `src/scanners/sourceSlopScanner.js`
- `unslop scan` command
- `npm run scan`
- `docs/SOURCE_SLOP_DETECTORS.md`
- `tests/sourceSlopScanner.test.js`

## Coverage

- unstable random keys
- array index keys
- missing focus-visible replacement
- icon-only button review
- image sizing review
- reduced-motion review
- async loading, error, and empty-state review
- collection empty-state review
- hardcoded color drift
- generic visual decoration review
- broad transition usage
- sample content leakage

## Changed

- Autopilot now respects `--no-source-scan`
- Source findings are printed cleanly in CLI output
- Source findings are mapped as code evidence in reports
