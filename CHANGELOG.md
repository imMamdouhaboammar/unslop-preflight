# Changelog

## [Unreleased]

## v1.12.0 - Real Autopilot Source Repair (2026-06-30)

### Added
- **Safe Source Fix Engine**: Created a secure, idempotent source fixer (`src/core/sourceFixEngine.js`) to apply precise, deterministic, local, and reversible source-code repairs.
- **7 Low-Risk Deterministic Fixers**:
  - Unsafe target="_blank" (adds `rel="noopener noreferrer"`).
  - Missing button type in JSX (adds `type="button"` with submit/save text exclusions).
  - Image missing loading lazy (adds `loading="lazy"` with hero exclusions and self-closing tag preservation).
  - Missing alt on decorative-looking images (adds `alt=""` with strict keyword checks).
  - Tailwind transition-all mapping (transforms to `transition-colors` or `transition-transform`).
  - Focus outline none (adds focus ring helpers only if Tailwind is detected).
  - Standalone production console.log remover.
- **Repair Mode Options**:
  - `--plan-only`: Run scans and reports without file modification.
  - `--doc-fix` (Default): Apply safe documentation/spec repairs only.
  - `--safe-fix`: Apply safe doc repairs and approved deterministic source fixes.
  - `--agent-fix`: Write optimized developer instructions to `.unslop/agent-fix-prompt.md`.
- **Patch Safety Check Validator**: Enforces strict boundaries to reject modified paths outside the project root, generated builds, lockfiles, node_modules, `.env`, or files violating size limits (default max 20 files, 50 lines/file, 300 total lines).
- **Synchronous Verification Loop**: Automatically detects the active package manager (`npm`, `pnpm`, `yarn`, `bun`), runs available checks (`typecheck`, `lint`, `test`, `build`) sequentially with an async-simulated sync execution loop and a configurable timeout (`--verify-timeout=120`), and blocks readiness on failures.
- **Before/After Proof Report**: Delta tracking for score improvements, blocker reduction, and findings reduction, displayed in a short markdown report table and `.unslop/report.json`.
- **Structured Fix Reports**: Saves detailed results to `.unslop/source-fixes.json`, `.unslop/source-fixes.md`, and human-friendly `.unslop/patch-summary.md`.
- **Exhaustive Unit Tests**: Added a complete suite of unit and integration tests under `tests/sourceRepair.test.js`.

## v1.11.3 - Maintainability & CLI Truth Pass (2026-06-30)

### Added
- **Audit Standards Integration**: Fully implemented and wired `--standards=vibe-coding` support inside the `audit` command.
- **Robust Integration Testing**: Added comprehensive integration tests covering CLI help output, standards commands, malformed pack manifests, and autopilot/audit standards integration.

### Changed
- **CLI Help Canonization**: Updated CLI help output to list `scan`, `standards list`, and `standards inspect` commands with truthful direct `npx` examples.
- **Standards Pack Warnings**: Surfaced corrupt or malformed standards pack manifests as warnings instead of silently hiding them.
- **Maintainability & Formatting**: Reformatted compressed files for better code readability.
- **Softened Documentation Overclaims**: Replaced overly strong language in `README.md` to truthfully position Unslop as a tool that flags and gates issues rather than stopping them.

### Added (earlier unreleased)
- **Security & Secret Hygiene Guidelines**: Added a dedicated `Secret and CI Hygiene` section to `SECURITY.md` detailing security policies, safe secret handling in GitHub Actions, instant token rotation instructions, and local `gitleaks` pre-scanning suggestions.

### Changed
- **Hardened Publish Workflow Triggers**: Restructured `.github/workflows/npm-publish.yml` to prevent automatic npm publishing on pushes to the `main` branch. Runs are now restricted to manual `workflow_dispatch` and push triggers on version tags (`v*`).
- **Enhanced Package Hygiene**: Tightened package exclusions by ignoring `marketing/` and maintainer-only documentation (`docs/PUBLISHING.md`) from packaged npm tarballs via root `.npmignore` and `docs/.npmignore` files.
- **CLI Commands Canonization**: Updated CLI instructions in `SECURITY.md` and other documentation files from deprecated `npx unslop` commands to use the standard `npx unslop-preflight` namespace.

## v1.11.2 - Autopilot Standards Integration & Assured CLI Commands (2026-06-30)

### Added
- **Seamless Autopilot Standards-Wiring**: Restored full support for modular standards packs (like `--standards=vibe-coding`) running inside the `autopilot` command loop.
- **Robust Test Coverage**: Added comprehensive integration testing verifying proper standards-wiring and rule executions through the entire multi-pass autopilot pipeline.
- **Benchmark Visibility & Groundedness**: Explicitly documented the internal Unslop Torture Bench baseline results (`3.00/5.0 - FAIL`) and refined project documentation to clearly frame Unslop as a preflight assistant, rather than a visual/testing replacement.

### Changed
- **CLI Command Canonization**: Updated suggested commands in reports, doctor messages, checklists, and templates from bare/shorthand `unslop` to use the primary `npx unslop-preflight <command>` namespace, preventing confusion when the package is not installed globally or locally as an alias.
- **CI Safety & Self-Scanning Bypass**: Updated the design-gates validation runner to safely bypass self-scanning on the `unslop-preflight` development repository itself, preventing circular regex patterns or template placeholders from causing false-positives in CI builds.

## v1.11.1 - Autopilot Hardening & Safety Controls (2026-06-30)

### Added
- **Real Max-Passes Loop**: Robust `--max-passes=N` pass refinement loop in autopilot to resolve issues sequentially.
- **Pass History**: Track pass-by-pass score history and action summary in report results.
- **Clean Stop Reasons**: Autopilot reports stopping reason (`agent-ready`, `no-safe-repairs`, `no-score-improvement`, `max-passes`, or `error`).
- **Scanner Failure Collection**: Scanner walk and crash errors are recorded as metadata in `scanStats` and treated as blocking evidence in `--strict` mode.
- **Testing Coverage**: Added full validation tests for autopilot refinement loop, scanner failures, stats reporting, and code fixes.
- **CI Hardening**: Build validation script checks CLI, commands, and core autopilot and reporter engines.

### Changed
- **Markdown Repair Spacing**: Restored readable, spacing-preserving formatting when safe document repairs are appended to markdown files.
- **Code Fix Truthfulness**: Compatibility flag `--apply-code-fixes` accurately reports requested state and does not falsely claim source modifications.

## v1.11.0 - Modular Standards Packs System & Vibe Coding Profile (2026-06-30)

### Added

- **Modular Standards Packs (Profiles)**: An optional, opt-in governance layer for highly-opinionated, domain-specific or team-specific coding rules.
- **Vibe Coding Standards Pack (`vibe-coding`)**: Native source-level linter enforcing strict TypeScript type system rules, unified unidirectional dependency flow, component modularity (max 150 lines soft limit, 250 lines hard blocker), centralized storage hygiene (no raw `localStorage`/`sessionStorage`), and credential secrets exposure scanning.
- **Standards Commands**:
  - `unslop standards list` to list registered standards profiles.
  - `unslop standards inspect [pack-id]` to view category-level principles and guidelines of a profile.
- **Enforced Standards Option**: `--standards=[pack-id]` flag supported globally on `scan`, `audit`, and `autopilot`.
- **Comprehensive Reports Metadata**: Standard profile name and rules are displayed in the Markdown preflight report, agent fix list, and JSON report metadata.
- **Product Documentation**:
  - `docs/STANDARDS_PACKS.md` (architecture, loaders, and extension guide).
  - `docs/VIBE_CODING_STANDARDS_PACK.md` (vibe coding rule descriptions and remediation).

### Changed

- Updated project `README.md` and `SKILL.md` to reference modular standards capabilities and commands.
- Configured CLI runner to globally validate `--standards` pack IDs, failing with clean outputs and exit code 1 on unknown standards to enforce strict compliance.

### Why it matters

Unslop remains lightweight and universally applicable by default, but complex repositories can now toggle strict standards profiles during preflight. This ensures AI-generated frontend implementations meet high-governance standards without requiring heavy, fragile shell or Python linters.

## v1.10.1 - npm Publishing Automation & Release Workflow (2026-06-30)

### Added

- GitHub Actions npm publish workflow at `.github/workflows/npm-publish.yml`.
- Manual release workflow at `.github/workflows/release.yml`.
- GitHub autogenerated release notes configuration at `.github/release.yml`.
- GitHub release template at `.github/RELEASE_TEMPLATE.md`.
- Trusted Publishing support through GitHub Actions OIDC with `id-token: write`.
- Duplicate-version guard that checks whether `unslop-preflight@version` already exists on npm before publishing.
- `npm pack --dry-run` verification before publish.
- `pack:dry-run` npm script.
- `docs/NPM_PUBLISHING.md` with setup instructions for npm Trusted Publishing and token fallback.

### Changed

- Bumped package metadata to `1.10.1` so GitHub publishable state can sync cleanly to npm.
- Synced `package-lock.json` with `package.json`.
- Added `preflight` as a real CLI alias for `autopilot`.
- Updated README badges, npm publishing docs, and release notes for the automated publish flow.

### Why it matters

This release closes the mismatch between the GitHub repository, GitHub Releases, and npm package state. The release workflow can create a matching tag, generate GitHub release notes, publish npm when the version is new, and skip npm when the version already exists.

## v1.10.0 - Source Slop Detector Layer (2026-06-30)

### Added

- `unslop scan` command for direct frontend source scanning.
- Source slop detectors for unstable React keys, index-key reorder risk, focus outline removal, icon-only buttons, image sizing, unsafe new-tab links, missing autocomplete behavior, reduced-motion coverage, empty states, async view states, token drift, generic visual stacks, broad transitions, and placeholder content.
- File-scoped scanner rules for checks that require whole-file context.
- File exclusion support for token, theme, test, story, fixture, and mock files.
- Tests for source slop scanner behavior.
- `docs/SOURCE_SLOP_DETECTORS.md`.

### Changed

- Autopilot now respects `--no-source-scan`.
- Source findings are mapped into code evidence and printable fix-list items.
- README and Skills.sh metadata now describe v1.10 source detector behavior.

### Why it matters

The original gates caught weak product and design handoffs. v1.10 adds implementation-level checks for the code patterns AI agents commonly ship after the handoff, giving the coding agent a concrete fix list before UI polish begins.

## v1.9.8 - Strict Gates & Torture Bench Alignment (2026-06-14)

### Changed

- **Package Renaming:** Renamed NPM package to `unslop-preflight` to avoid registry naming conflicts.
- **Strict Gates Enforcement:** All gates and rules now run in strict mode. All `warning` and `info` severity levels across all rules have been elevated to `error`.
- **Validation Script Hardening:** `validate-design-md.mjs` and `run-gates.mjs` now enforce stricter regex checks and treat any warning as an immediate failure. Added more strict AI-slop words like "seamless", "delve", and "robust" to the blacklist.
- **Heuristic & Regex Fixes:**
  - Narrowed down `mobileGuard` in `src/rules/modalViewport.js` to avoid matching generic keyboard navigation headers.
  - Corrected `modal-internal-scroll-risk` scanner pattern in `src/scanners/overlayScanner.js` to properly identify `overflow-y-scroll`.
  - Upgraded rule checks to strip auto-injected unslop blocks first, preventing cascading dependencies and ensuring idempotency.
- **Test Fixes:** Updated tests to account for the new strict behavior and the preference for `AGENTS.md`.

### Why it matters

To guarantee the highest quality of AI-generated implementations, there can be no "soft" failures. Aligning torture bench cases and enforcing all gates as strict errors ensures that no weak design specifications or unresolved assumptions slip through to the coding agent, while maintaining perfect idempotency across multiple audit passes.

## v1.9.7 - Visual Slop Gates (2026-06-14)

### Added

- **Modal scrollbar treatment gate.** Long overlays must remain scrollable without exposing a heavy native scrollbar on the modal shell.
- **Modal shell scrollbar risk warning.** `DESIGN.md` now flags shell-level scrollbar language unless the design defines a restrained body-pane scroll treatment.
- **Typography governance.** New rules require a type scale, hierarchy roles, responsive caps for oversized headings, line-height guidance, and RTL/Arabic typography handling.
- **Typography guide.** Added `docs/TYPOGRAPHY_GATES.md`.
- **Visual slop smoke tests.** Added focused tests for modal scrollbar and typography gates.

### Why it matters

AI coding agents often produce modal forms with ugly exposed scrollbars and random headline sizes. This release blocks those patterns at the design artifact stage before implementation.

## v1.9.6 - Install Agent Harness Gate (2026-06-14)

### Added

- **Install Agent Harness readiness.** The audit system now checks whether the agent handoff asks the coding agent to inspect the project and recommend only the missing skills, tools, and harnesses needed for the current work.
- **Bulk-install guard.** Harness guidance must warn against installing every available skill or tool because unnecessary global context can slow or confuse AI coding agents.
- **Priority matrix requirement.** Harness recommendations should explain priority, project-specific reason, when to use the item, and when to skip it.
- **Trust and verification notes.** Harness guidance should include source review, version checks, dry runs, restart notes, and rollback guidance where relevant.
- **Harness catalog guide.** Added `docs/INSTALL_AGENT_HARNESS.md` to explain how to classify design, review, planning, research, runtime, and external-app harnesses.

### Why it matters

Many VDMA users are vibe coders who do not know which agent skills, scanners, plugins, and runtime helpers are worth installing. This gate turns setup into a project-specific recommendation step instead of a bulk-install habit.

## v1.9.5 - Root Cause Mode Gates (2026-06-13)

### Added

- **Root Cause Mode.** Bug, issue, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, and layout failure language now triggers diagnosis-first governance.
- **Patch-language blocker.** Quick fixes, workarounds, magic numbers, `z-9999`, and `z-index: 9999` are blocked when used without root cause analysis.
- **Verification proof rule.** Root fixes now require proof such as tests, audit output, viewport cases, state cases, or acceptance criteria.
- **Root Cause Mode guide.** Added `docs/ROOT_CAUSE_MODE.md`.

### Why it matters

This release encodes the practical prompt pattern "fix the problem from the root" into the audit system. The agent must diagnose the cause before editing instead of patching visible symptoms.

## v1.9.4 - Modal Viewport and Stacking Reasoning Gates (2026-06-13)

### Added

- **Strict modal viewport gates.** `DESIGN.md` now fails with errors when modals, dialogs, popups, drawers, sheets, popovers, overlays, lightboxes, command palettes, or toasts are mentioned without a viewport contract.
- **Overlay sizing requirements.** Overlays now require explicit width guards, height guards, internal scroll behavior, mobile behavior, and viewport QA proof.
- **Stacking reasoning gate.** Layered UI such as modals, drawers, dropdowns, tooltips, toasts, sticky headers, and fixed headers now requires a stacking or placement plan before implementation.
- **High layer value guard.** Raising layer values without a diagnosis is treated as a design risk instead of an acceptable fix.

### Why it matters

This release targets a repeated AI implementation failure: popups and modals that overflow the viewport, get clipped by parents, appear under headers, or are patched with arbitrary high layer values. The system now blocks those issues at the design artifact stage before a coding agent touches frontend code.

## v1.9.3 - AI Agent Readiness, Taste Calibration, and AGENTS.md (2026-06-13)

### Added

- **AGENTS.md as the primary agent guidance file.** `init`, `audit`, `repair`, reports, templates, and package publishing now understand `AGENTS.md` while preserving compatibility with existing `AGENT.md` files.
- **AI agent readiness bands.** Audit output now translates scores into practical decisions:
  - `blocked`
  - `needs-spec-work`
  - `agent-ready-with-fix-list`
  - `agent-ready`
- **Category breakdowns.** Reports now explain where the risk lives instead of showing only a raw score. Categories include product clarity, design contract, taste calibration, placeholders, accessibility, responsive behavior, security, and agent guidance.
- **Taste calibration rules.** New `src/rules/taste.js` checks for:
  - Design Read
  - Taste Controls
  - dial values from 1 to 10
  - Design System Decision
  - default AI aesthetic risk
  - Pre-flight Check
- **Placeholder gates.** New placeholder detection blocks unresolved template markers in `PRODUCT.md` and `DESIGN.md`, including `[audience]`, `[Feature 1]`, `TODO`, `TBD`, and ellipsis-only placeholders.
- **Updated generated templates.** New projects now start with `Design Read`, `Taste Controls`, `Design System Decision`, `Anti-AI-Slop Guidelines`, `Agent Handoff`, and `Pre-flight Check` sections.
- **Agent-ready reports.** `.unslop/report.md` and fix-list output now include readiness, category breakdown, and instructions to read `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md` before implementation.
- **Documentation for the readiness system.** Added `docs/AI_AGENT_READINESS.md` as the technical guide for readiness bands, taste rules, placeholder blocking, and report behavior.

### Changed

- `AGENTS.md` is now preferred for new projects.
- Existing `AGENT.md` files are still respected for backward compatibility.
- `repair` now creates or updates the active agent guidance file correctly instead of always targeting `AGENT.md`.
- README, SKILL.md, CONTRIBUTING.md, skills.sh metadata, and repository agent instructions were updated to describe the new behavior.
- `package.json` now includes `AGENTS.md` and `docs/` in the published package files.

### Why it matters

This release moves the system from a checklist-only design gate to an AI-agent readiness layer. VDMA now checks whether the design artifacts are specific enough for a coding agent, whether the visual direction has real taste constraints, and whether unresolved placeholders would cause the agent to invent missing product decisions.

### Migration notes

- No breaking change for users with `AGENT.md`; the system still detects it.
