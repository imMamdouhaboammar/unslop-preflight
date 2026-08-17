# Autonomous Development Baseline

Date: 2026-08-17

Starting default-branch commit: `1b882bb911979977126e0354c0e84ddb61807b5b` (`main`, package version `1.15.2`).

This document is a repository-reality baseline for autonomous daily engineering. It is descriptive, not a frozen roadmap. Future runs must re-check the live repository, recent commits, PRs, issues, CI, tests, and documentation before selecting work.

## Product shape

Unslop Preflight is a Node.js ESM CLI for preflight analysis and bounded repair of frontend-oriented projects. The README presents source scanning, accessibility/layout/copy checks, autonomous repair, browser review, and agent workflows as a unified product surface.

The repository currently contains two broad analysis families:

1. Specification/audit rules under `src/rules/`, evaluated against project handoff documents through `src/core/auditor.js`.
2. Source scanners under `src/scanners/` and scripts, coordinated by `src/core/sourceScanner.js` and converted into the common reporting/scoring model by `src/commands/scan.js`.

## Scanner architecture

`src/core/sourceScanner.js` coordinates source-level scanning. Modular scanners use `scanWithRules()` from `src/core/scannerUtils.js`.

`scanWithRules()` currently:

- walks supported source extensions recursively;
- skips common generated/dependency directories;
- supports file-scoped regex rules;
- supports line-scoped regex rules;
- invokes optional whole-file heuristics after regex matching.

The important consequence is that a rule with both a `pattern` and a `heuristic` can emit an automatic line finding before its heuristic runs. A heuristic-only detector should therefore avoid a broad `pattern` when the pattern does not itself satisfy the detector contract. The `long-arabic-text-height` placeholder exposed this exact failure mode.

## Parser architecture

There is no general JavaScript/TypeScript/JSX AST dependency in the inspected package manifest. Most current source checks are text/regex/heuristic based.

For the 2026-08-17 initiative, a bounded markup tokenizer is kept local to the typography scanner rather than introducing a repository-wide parser architecture. It recognizes static HTML/JSX-like element boundaries, skips JavaScript string/comment content when locating JSX candidates, skips `script`/`style` raw text, and deliberately does not evaluate dynamic JSX text expressions.

This is not a complete JSX/TypeScript parser. Parser-wide reuse should be a separate initiative only after multiple rules demonstrate the same need.

## Rule architecture

A modular source rule typically provides:

- `name`;
- `level`;
- optional `pattern`;
- optional `scope`;
- optional `excludeFile`;
- optional `message`;
- optional `heuristic(content, file, findings)`.

Legacy source findings normally contain `file`, `line`, `level`, `rule`, and `excerpt`. `src/commands/scan.js` converts them into issues and the shared `Evidence` model.

## Finding model

`src/core/findings.js` defines `Evidence` with:

- rule name;
- symptom and likely root cause;
- evidence snippet;
- file/line;
- fix and verification guidance;
- confidence;
- impact;
- severity;
- effort;
- type.

Source scanner findings remain a smaller legacy shape and are normalized by `scan` before scoring/reporting.

## Severity model

The repository currently uses both source-scanner levels (`blocker`, `warning`, `info`) and normalized evidence severity. `src/commands/scan.js` maps `blocker` to `error` before summarization. The scoring/reporting layer should remain the authority on how those normalized severities affect readiness.

## Repair architecture

There are distinct repair paths:

- `src/core/repair.js` performs bounded documentation/template repairs with marker-based idempotency.
- `src/core/sourceFixEngine.js` contains deterministic source-text fixers for selected source findings.
- `src/core/safetyValidator.js` constrains file paths, extensions, lockfiles, sensitive environment files, generated directories, and patch-size limits.
- `src/core/verify.js` can run repository verification scripts while rejecting commands that look like dev servers, deployment, publishing, installation, destructive cleaning, or watchers.

The README currently describes `repair` as performing AST transformations, while the inspected source-fix implementation is text/regex based. That documentation/implementation mismatch is recorded as a candidate rather than silently accepted as fact.

## CLI architecture

`src/cli.js` dispatches commands including `autopilot`, `preflight`, `init`, `audit`, `repair`, `report`, `doctor`, `update`, `standards`, `loop`, `review`, and a lazily imported `scan` command.

Argument parsing and output live under `src/core/output.js`; command handlers live under `src/commands/`.

At the starting commit, `--strict` exit behavior and `--plan-only` zero-write behavior already have active pull requests (#21 and #22). Those initiatives are excluded from today's work to avoid duplicate implementation.

## Configuration and project discovery

Project shape is inferred through project fingerprinting and CLI flags. Scans may target a supplied source directory. Standards packs provide another explicit configuration surface.

No need was found during this baseline to introduce a new general configuration file or plugin system.

## File and framework coverage

The shared walker recognizes `.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.vue`, `.svelte`, `.css`, `.scss`, and `.mdx` files. Recognition of an extension does not imply equivalent semantic understanding for every framework.

Current frontend behavior checks are strongest where deterministic text signals exist. React/JSX, Tailwind-style utility strings, HTML semantics, CSS, and common source anti-patterns receive meaningful coverage. Next.js-, Vue-, Svelte-, and runtime-visual semantics are less complete and should not be overstated.

## Test architecture

`package.json` uses Node's built-in test runner:

`node --test --test-concurrency=1 tests/*.test.js`

The serial setting is intentional after a recent integrity-race fix. Tests commonly create temporary project directories and invoke public/core scanner functions against fixture source. Additional repository fixture directories are used by broader evaluation/gate scripts.

For new detectors, the daily engineering standard is positive + negative + boundary + multiline/framework + adversarial coverage, with explicit false-positive and false-negative tests.

## Verification architecture

The package scripts expose:

- `npm test`;
- `npm run build` (syntax checks for key entry points);
- `npm run pack:dry-run`;
- `npm run evals`;
- `npm run gates`.

`src/core/verify.js` detects the project package manager and can run `typecheck`, `lint`, `test`, and `build` scripts when present and considered safe.

## CI

`.github/workflows/ci.yml` runs on pull requests targeting `main` and pushes to `main`. The main checks job uses Node 20 and runs `npm ci`, tests, build, package dry-run, evals, and gates. A separate skill lint job validates skill metadata/files.

Open issue #19 records a supply-chain hardening opportunity: the workflow currently references major-version action tags rather than immutable commit SHAs.

## Performance characteristics

No benchmark evidence was generated during the baseline, so no optimization claim is made.

The current architecture may traverse/read overlapping source sets more than once because source scanning combines multiple scanner families. Optimizing this should require measurement first. A future shared parse/read-once pipeline is a candidate, not an assumption.

## Security boundaries

Observed safeguards include:

- source walking skips dependency/build directories;
- source repair path validation blocks traversal outside the project root;
- environment files and package-manager lockfiles are protected;
- allowed repair extensions and patch-size limits are explicit;
- verification refuses command categories associated with servers, deployment, publishing, installation, destructive cleaning, or watching;
- scanning source does not require executing the scanned source code.

Open issue #19 means CI action pinning remains a known supply-chain gap.

## Packaging

The package is ESM, requires Node `>=18`, and exposes the `unslop` binary. The inspected manifest has a deliberately small dependency surface and defines dry-run packaging verification. Release/publish actions are out of scope for autonomous daily runs.

## README-to-implementation checks

Verified or partially verified claims:

- source scanning and source findings exist;
- repair safety boundaries exist;
- CLI scan/autopilot/repair/review/loop/doctor surfaces exist;
- CI includes test/build/package/eval/gate checks.

Claims needing caution:

- the README phrase "AST transformations" does not match the inspected regex/text source fix engine;
- extension support should not be interpreted as equal semantic/framework coverage;
- browser-backed capabilities exist as product surfaces, but static source detectors should not claim runtime certainty.

## 2026-08-17 candidate scorecard

Scales are 1–10. `M`, `FP`, and `Reg` are costs/risks where higher is worse. Priority uses the daily formula:

`2F + 2S + D + U + P + Dif + T - M - FP - Reg`

`R` (repair confidence) and `Cov` (framework coverage) are still recorded even though they are not terms in the priority formula.

| Candidate | F | S | D | R | U | P | Dif | T | Cov | M | FP | Reg | Priority |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Implement bounded `long-arabic-text-height` detector (#18) | 6 | 6 | 9 | 2 | 8 | 9 | 8 | 10 | 8 | 3 | 3 | 2 | **60** |
| Prefer `AGENTS.md` in doctor while preserving compatibility (#16) | 7 | 5 | 10 | 9 | 8 | 7 | 4 | 10 | 10 | 2 | 1 | 3 | 57 |
| Pin GitHub Actions to immutable SHAs (#19) | 8 | 8 | 10 | 8 | 8 | 6 | 3 | 7 | 10 | 4 | 1 | 4 | 57 |
| Strengthen source-fixer post-verification/idempotency evidence | 6 | 8 | 8 | 7 | 9 | 10 | 8 | 9 | 8 | 7 | 3 | 6 | 56 |
| Align README AST-repair claim with actual repair architecture | 7 | 4 | 10 | 9 | 7 | 8 | 3 | 9 | 10 | 2 | 1 | 2 | 54 |
| Improve source finding location precision for repeated same-line matches | 8 | 4 | 9 | 4 | 7 | 8 | 5 | 9 | 9 | 4 | 1 | 5 | 52 |
| Add changed-files scan mode with Git edge-case tests | 8 | 5 | 8 | 7 | 9 | 9 | 7 | 8 | 10 | 7 | 3 | 6 | 51 |
| Add baseline/new-finding adoption support | 7 | 6 | 7 | 5 | 9 | 9 | 7 | 8 | 10 | 8 | 4 | 7 | 47 |
| Resolve dynamic class-expression boundary for element-local detectors | 7 | 6 | 5 | 2 | 8 | 9 | 7 | 8 | 7 | 8 | 6 | 6 | 43 |
| Measure and reduce repeated source traversal/parsing | 6 | 4 | 7 | 7 | 7 | 8 | 6 | 8 | 10 | 7 | 2 | 6 | 41 |

## Selected initiative

`long-arabic-text-height` is selected because it is already a registered product capability with an empty heuristic, has a precise issue contract, can be tested at 79/80-character boundaries, and has strong false-positive controls without requiring an unsafe repair.

Issues #14, #15, and #17 were not candidates for duplicate implementation because active PRs #21, #22, and #20 already address them.

## Revisit policy

This baseline is evidence from the starting commit, not authority over later repository reality. Each daily run must refresh repository state and reject candidates that have already been completed, superseded, or invalidated.
