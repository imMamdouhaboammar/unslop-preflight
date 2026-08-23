# Autonomous Development Baseline

Date: 2026-08-23

Starting default-branch commit: `a56191fe22d0f8cc39ab4641cc392236e2e49973` (`main`, package version `1.15.2`).

This is a repository-reality baseline for autonomous engineering. It is descriptive, not a frozen roadmap. Every run must re-check the live default branch, recent commits, pull requests, issues, CI, implementation, tests, and documentation before selecting work.

## Product shape

Unslop Preflight is a Node.js ESM CLI that combines specification/readiness auditing with frontend source scanning and bounded source/document repair. The source path is most relevant to the daily frontend-quality mission: discover supported files, scan them with deterministic rules and bounded heuristics, normalize findings, optionally apply safe text mutations, re-scan, verify, and report.

The repository has two broad analysis families:

1. Specification/audit rules under `src/rules/`, evaluated by `src/core/auditor.js`.
2. Source scanners under `src/scanners/` and `scripts/`, coordinated by `src/core/sourceScanner.js` and normalized by command/autopilot code.

## Current pipeline map

```text
file discovery
→ parsing / bounded text interpretation
→ rule execution
→ findings
→ severity / confidence normalization
→ bounded repair
→ re-scan / verification
→ reporting
```

### File discovery

`src/core/scannerUtils.js` and the legacy script scanners walk supported frontend source files while skipping dependency/build output. `src/core/sourceScanner.js` coordinates scanner families over fingerprinted source directories and deduplicates findings.

Supported extensions include `.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.vue`, `.svelte`, `.css`, `.scss`, and `.mdx`. Extension support does not imply equal semantic understanding for every framework.

### Parsing

There is no repository-wide JavaScript/TypeScript/JSX AST dependency in the package manifest. Most source analysis uses text, regex, line scanning, or rule-local heuristics. The typography scanner contains a bounded markup tokenizer for one class/text relationship, but it is not a general JSX parser.

This matters to detector design: regex is appropriate only where the evidence is local and deterministic. Dynamic expressions, prop spreads, aliases, runtime state, computed styles, and cross-component behavior are intentional confidence boundaries unless a rule has stronger evidence.

### Rule execution

`src/core/sourceScanner.js` runs:

- the UI implementation scanner;
- the accessibility scanner;
- modular scanner rules for overlays, typography, layering, responsive behavior, source slop, and optional standards packs.

`scanWithRules()` supports line/file regex checks plus optional whole-file heuristics. Detector authors must avoid broad patterns that fire before a narrower heuristic establishes the rule contract.

### Finding model

Legacy source findings contain fields such as `file`, `line`, `level`, `rule`, and `excerpt`. Higher-level flows normalize them into the common `Evidence` model with explanation, confidence, impact, severity, effort, and verification guidance.

### Severity and confidence

Source rules currently use `blocker`, `warning`, and `info`, while normalized evidence/reporting uses its own severity vocabulary. Severity should describe consequence, not certainty. Current source findings are normalized with high confidence by the autopilot path, which makes detector precision and conservative applicability especially important.

The 2026-08-23 initiative corrects one severity mismatch: a plain `target="_blank"` link no longer represents a modern-browser blocker because current HTML behavior implies `noopener`; explicit `rel="opener"` remains a blocker because it intentionally restores opener access.

### Repair pipeline

Repair is deliberately separate from detection:

- `src/core/repair.js` performs bounded documentation/template repairs.
- `src/core/sourceFixEngine.js` performs deterministic source-text rewrites for selected source findings.
- `src/core/safetyValidator.js` constrains paths, extensions, lockfiles, sensitive files, and patch size.
- `src/core/autopilotPlan.js` re-runs source scanning after applied safe source fixes.
- `src/core/verify.js` can execute recognized verification scripts while rejecting server, deployment, publishing, installation, destructive-cleaning, and watcher commands.

Recent default-branch work strengthened repair safety around target-blank rel-token preservation, real patch-line accounting, avatar alt-text mutation, and button/form scoping. Open issue #27 remains important because post-repair evidence is not yet uniformly transactional: the engine can write a safe patch without independently proving per-fix detector disappearance and second-pass idempotency before accepting the mutation.

### Reporting

CLI and autopilot flows produce normalized summaries, issue lists, repair outcomes, scan stats, verification results, and report artifacts. Scanner failures are represented instead of being silently swallowed.

## CLI and configuration

`src/cli.js` dispatches commands including `autopilot`, `preflight`, `init`, `audit`, `repair`, `report`, `doctor`, `update`, `standards`, `loop`, `review`, and `scan`.

Project fingerprinting and CLI flags select source directories and standards packs. No repository evidence currently justifies introducing a new general plugin/configuration architecture.

## Framework coverage

Coverage is strongest for static HTML/JSX-like markup, React-shaped source, Tailwind-style class strings, common CSS/text signals, accessibility semantics, overlay/layout risks, and generated-copy patterns.

Important limits remain:

- Next.js server/client and hydration semantics are weakly modeled.
- Vue/Svelte files are discoverable but do not receive equivalent framework-aware analysis.
- dynamic JSX props/classes/text are often outside deterministic regex evidence;
- runtime focus, clipping, overflow, stacking geometry, and offscreen controls need browser evidence for high certainty.

See `docs/architecture/rule-coverage-matrix.md` for category-level ratings.

## Tests and fixtures

`package.json` uses Node's built-in test runner:

```text
node --test --test-concurrency=1 tests/*.test.js
```

Tests commonly create temporary projects and execute scanner/core functions against focused fixtures. The suite also covers CLI behavior, repair safety, architecture gates, integrity, packaging-related contracts, and framework-shaped source examples.

Detector work should include positive, negative, boundary, framework/syntax, and adversarial cases where relevant. Behavior changes should follow red → green evidence; verification after the final code mutation is the only fresh completion evidence.

## CI

`.github/workflows/ci.yml` runs for pull requests targeting `main` and pushes to `main`. The main job uses Node 20 and runs:

- `npm ci`;
- `npm test`;
- `npm run build`;
- `npm run pack:dry-run`;
- `npm run evals`;
- `npm run gates`.

A separate job validates skill/package metadata. External GitHub Actions are currently pinned to full immutable commit SHAs, and tests explicitly enforce that policy. The older 2026-08-17 baseline note describing action pinning as an open gap is therefore obsolete.

## Performance

No current benchmark proves that scanner traversal or parsing is a bottleneck. Multiple scanner families can traverse/read overlapping source sets, so shared read/parse work remains a plausible optimization candidate only after measurement. Correctness and detector trust take precedence over small speculative performance gains.

## Security boundaries

Observed safeguards include:

- dependency/build directories excluded from source walks;
- repair path validation against traversal outside the project root;
- protected environment and package-manager lockfiles;
- explicit repair extensions and patch-size bounds;
- safe-command filtering for verification;
- source scanning that does not require executing scanned repository code;
- immutable GitHub Actions pins enforced by tests.

Frontend security findings must still reflect current platform behavior. The target-blank policy is the concrete example in this run: implicit modern `noopener` is informational/hardening evidence, while explicit `rel="opener"` is the meaningful blocker.

## Packaging

The package is ESM, requires Node `>=18`, exposes `unslop-preflight` and `unslop` binaries, has a deliberately small dependency surface, and validates packaging with `npm pack --dry-run`. Release and publish actions remain outside autonomous maintenance authority.

## README-to-implementation checks

Verified or partially verified claims include source scanning, bounded repair, CLI scan/autopilot/repair/review flows, browser-review surfaces, test/build/package/eval/gate CI, and safety validation.

Claims needing qualification:

- README wording that source repair performs "AST transformations" does not match the inspected text/regex `SourceFixEngine`; tracked in issue #28.
- supported extensions should not be read as equal semantic framework coverage;
- browser-backed capabilities should not be conflated with certainty from the default static scanner.

## 2026-08-23 ranked improvement candidates

Scores are comparative engineering judgments based on repository evidence and current product fit; they are not shipped-behavior claims.

| Rank | Candidate | Why it ranks here |
|---:|---|---|
| 1 | Align `target="_blank"` severity with current browser behavior (#31) | Existing blocker is a high-confidence false-positive/severity problem; current standards make the boundary precise and easily testable. |
| 2 | Prove safe source repairs remove triggering findings and are idempotent (#27) | Direct repair-safety contract gap with high user trust value; requires careful rollback/transaction design. |
| 3 | Remove or qualify README AST-repair claims (#28) | Clear documentation/implementation mismatch with low implementation risk. |
| 4 | Add changed-files scanning with explicit Git semantics | High CI/developer value and already identified as missing; needs staged/unstaged/base-ref edge-case design. |
| 5 | Add baseline/new-findings adoption support | Would let CI block regressions without historical-noise overload; fingerprint stability needs design. |
| 6 | Improve same-line/multi-match source location precision | Better explanations and repair targeting; current findings are primarily line-oriented. |
| 7 | Strengthen Next.js server/client and browser-API misuse coverage | Framework coverage remains weak, but detectors need AST-aware or highly bounded evidence to avoid noise. |
| 8 | Improve form label/control relationship detection | Common accessibility failure with real impact; dynamic IDs/component abstractions create false-positive boundaries. |
| 9 | Resolve dynamic class-expression boundaries for element-local detectors | Would reduce false negatives across responsive/typography rules; parser scope and maintenance cost are significant. |
| 10 | Add optional runtime overflow/dialog geometry evidence | Static checks cannot prove clipping/offscreen controls; browser execution must remain isolated and optional. |
| 11 | Measure repeated traversal/read cost before shared parsing | Potential performance win, but no benchmark currently proves urgency. |
| 12 | Improve Vue/Svelte semantic applicability metadata | File discovery exists but framework-aware confidence is weaker than React/JSX coverage. |

## Selected initiative

Issue #31 is selected for 2026-08-23. Current browser/HTML behavior gives a crisp failure model:

- `target="_blank"` without an explicit rel token uses implicit `noopener` in modern browsers, so treating it as a production blocker inflates severity and creates noise.
- `target="_blank" rel="opener"` explicitly restores `Window.opener`, so it deserves a separate blocker with a clear review boundary.
- explicit `noopener`/`noreferrer` remains accepted.
- dynamic target/rel expressions remain outside this static detector's claim.

The initiative changes detection policy only. It does not broaden parsing architecture or automatically remove an explicit `opener`, because that mutation could intentionally alter cross-window behavior.

## Revisit policy

This baseline is evidence from the stated starting commit, not authority over future repository reality. Re-check it after material scanner, parser, repair, CLI, security, performance, or CI changes.
