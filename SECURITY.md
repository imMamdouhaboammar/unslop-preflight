# Security

Unslop is a local-first skill and CLI for design planning before frontend implementation.

## What this package does

- Reads and writes local Markdown files such as `PRODUCT.md`, `DESIGN.md`, `INTAKE.session.md`, and `STANDARDS.search-notes.md`.
- Runs local validation, scoring, and scanning scripts.
- Optionally attempts `npx unslop skills install` when the user runs preflight or autopilot.
- Does not collect secrets.
- Does not require API keys.
- Does not send project files to external services.
- Does not include postinstall or preinstall lifecycle scripts.

## Files it may create

- `PRODUCT.md`
- `DESIGN.md`
- `INTAKE.session.md`
- `STANDARDS.search-notes.md`
- `DESIGN.amplified.md`
- `DESIGN.amplification-report.md`
- `VDMA-FIXES.md`

## Network behavior

The package itself is local-first. The only network-related behavior is user-triggered package installation through npm/npx commands such as:

```bash
npx unslop skills install
```

This command is optional and visible in terminal output.

## Dependency policy

This package should avoid runtime dependencies unless strictly necessary. Optional tools such as Playwright must be installed by the user in their own project.

## Reporting issues

Open a GitHub issue if you find a security concern.
