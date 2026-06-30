# Autopilot Source Truth Audit

This audit evaluates the truthfulness of `unslop-preflight` package claims against the actual codebase implementation as of June 30, 2026.

## Package Identity & Direct Usage

- **Package Name**: `unslop-preflight`
- **Package Version**: `1.11.1`
- **Documented Quick Start Command**: Currently documented as `npx unslop autopilot` in some places of the README and examples, which is incorrect/misleading for users who have not installed the package locally or globally.
- **Correct Direct NPX Command**: `npx unslop-preflight autopilot`
- **Install/Alias Naming Plan**:
  - Direct execution without installation: `npx unslop-preflight autopilot`
  - Local devDependency: `npm install --save-dev unslop-preflight` followed by `npx unslop autopilot`
  - Global installation: `npm install -g unslop-preflight` followed by `unslop autopilot`

## Autopilot Hardening Status

- **Actual Autopilot Flags**:
  - `--max-passes=N` (or `--maxPasses=N`)
  - `--no-source-scan` (or `--source-scan=false`)
  - `--dry-run`
  - `--strict`
  - `--ci`
  - `--json`
  - `--report`
  - `--apply-code-fixes`
  - `--standards=vibe-coding`
- **Is multi-pass implemented?**: Yes, the core pipeline `runAutopilotPipeline` in `src/core/autopilotPlan.js` runs a loop up to `maxPasses` (default: 1, up to 10 passes).
- **Does `passes[]` exist in output?**: Yes, the pipeline returns a `passes` array representing the historical execution of each pass.
- **Does `stopReason` exist in output?**: Yes, populated at the end of the pipeline execution with reasons like `agent-ready`, `no-safe-repairs`, `no-score-improvement`, `max-passes`, or `error`.
- **Does `scanStats` exist in output?**: Yes, populated under the `scanStats` field of the autopilot result containing:
  - `filesScanned`
  - `filesSkipped`
  - `findings`
  - `scannerFailures`
  - `durationMs`
  - `scannersRun`
  - `scannersSkipped`
- **Are scanner failures reported?**: Yes, caught exceptions in individual scanners are recorded with `status: 'failed'` and appropriate error messages.
- **Are standards commands registered and functional?**:
  - `standards list`: Yes, registered and outputs registered standards packs.
  - `standards inspect <id>`: Yes, registered and details the specified pack.
- **Is `--standards` wired into scan/audit/autopilot?**:
  - **scan**: Yes, wired.
  - **audit**: N/A (audit only runs documentation spec rules, which do not accept standards pack).
  - **autopilot**: ❌ **NOT FULLY WIRED**. The `runSourceScan` helper in `src/core/autopilotPlan.js` fails to forward the `flags` parameter to `runSourceScanners`, meaning `--standards=vibe-coding` is ignored during autopilot scans.

## CI, Testing & Release Quality Gates

- **Does CI run test/build/package dry-run?**: Yes, `.github/workflows/ci.yml` runs `npm ci`, `npm test`, `npm run build`, `npm run pack:dry-run`, and `npm run evals`.
- **Additional commands to add**: `npm run gates` should be run in CI to verify spec gates on DESIGN.md and PRODUCT.md.
- **Benchmark status**: ❌ **FAIL** (Average Score: 3.00/5.0, Critical Misses: 3, Threshold < 4.0).
- **README Tone & Claims**: The README overclaims success, implying absolute reliability and complete coverage. It must be softened to state that Unslop is a preflight helper and fix-list generator, not a complete replacement for rigorous testing or manual visual/A11y/QA audits.

## Exact Source Files to Change

1. `src/core/autopilotPlan.js`: Pass `flags` to `runSourceScanners` in `runSourceScan` to wire up `--standards` correctly in autopilot.
2. `README.md`:
   - Replace any direct quickstart `npx unslop autopilot` commands with `npx unslop-preflight autopilot`.
   - Update quickstart section to clarify local and global installation aliases.
   - Soften overclaims and document experimental status, benchmark limitations (FAIL), and known misses.
3. `.github/workflows/ci.yml`: Add `npm run gates` to the checks step.
4. `src/commands/audit.js`: Reformat line 3 to avoid single-line compressed structure.
