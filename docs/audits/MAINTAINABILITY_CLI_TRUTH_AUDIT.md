# Maintainability and CLI Truth Audit (v1.11.3)

This audit is part of the stabilization pass for **v1.11.3 - Maintainability and CLI Truth Pass**.

## 1. Overview and Current State

- **Current package version:** `1.11.2` (defined in `package.json`).
- **Current README direct npx command:** `npx unslop-preflight autopilot`.
- **Current CLI commands exposed in `src/cli.js`:**
  - `autopilot` / `preflight`
  - `init`
  - `audit`
  - `repair`
  - `report`
  - `doctor`
  - `update`
  - `standards`
  - `scan` (handled conditionally under `run` command checks)
- **Current CLI commands shown in help output (`src/core/output.js`):**
  - `autopilot`
  - `init`
  - `audit`
  - `repair`
  - `report`
  - `doctor`
  - `update`
- **Whether `scan` appears in help:** ❌ No.
- **Whether `standards` appears in help:** ❌ No.
- **Whether `audit --standards` is implemented:** ❌ No (the flag is accepted by CLI registry validation globally, but does not execute standard checks during the audit command; it is ignored).
- **Whether source files are compressed:** 
  - Source files are generally readable, but some parts of `tests/cli.test.js` contain compressed single-line test cases that reduce maintainability.
- **Which files need formatting / expansion:**
  - `tests/cli.test.js` (requires reformatting compressed tests into a readable, multi-line format).
- **Tests currently covering max-passes, scanStats, standards commands, and scanner failures:**
  - `tests/autopilot-hardening.test.js` covers `max-passes=1`, `max-passes=2`, `scanStats` reporting, and `scanner failures`.
  - `tests/standardsPacks.test.js` covers standard packs loading and errors.
  - `tests/standardsPackScanner.test.js` covers standard pack rule scanning logic.
  - No dedicated CLI tests cover the output of `standards list` or `standards inspect`.
- **Remaining README overclaims:**
  - The phrase "That is the work Unslop is built to stop." in the intro.
  - Other instances of overly strong/absolute language such as complete prevention where only flagging or gating occurs.

---

## 2. Action Plan

1. **Reformat source and tests for maintainability:** Reformat `tests/cli.test.js` to place each assertion/expression on its own line in standard JS style.
2. **Update CLI help:** Modify `src/core/output.js` to list `scan`, `standards` (with its subcommands), correct npx command examples, and clean explanations.
3. **Clarify/Implement `audit --standards`:** Wire standards pack scanning to the `audit` command when `--standards=vibe-coding` is passed, ensuring unknown packs fail clearly and the selected standards pack is recorded.
4. **Make standards pack manifest errors visible:** Update `src/core/standardsPacks.js` and `src/commands/standards.js` to catch and surface warnings for malformed pack manifests rather than silently ignoring them.
5. **Add direct tests for new/recent features:**
   - Add tests verifying the direct npx command in README.
   - Add tests verifying CLI help content.
   - Add tests verifying `standards list` and `standards inspect vibe-coding` behavior.
   - Add tests covering the new `audit --standards=vibe-coding` integration.
6. **Soften overclaims:** Audit and replace absolute language in `README.md` and related docs with precise gating/flagging terminology.
7. **Maintain documentation consistency:** Update CHANGELOG and verify package configuration.
