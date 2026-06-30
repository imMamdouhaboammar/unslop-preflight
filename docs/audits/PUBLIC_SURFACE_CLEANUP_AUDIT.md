# PUBLIC SURFACE CLEANUP AUDIT

**Date**: 2026-06-30  
**Repository**: `unslop-preflight`  
**Status**: ⚠️ CLEANUP REQUIRED  

---

## 1. Secrets and Key Scan Summary (Phase 2)

A rigorous fallback key scan was executed across all workspace files for credentials, private keys, access tokens, and environment configurations.

* **Real Secrets Found**: 0 (NONE)
* **Secret Placeholders Found**: Safe OIDC and token references in workflows and documentation (e.g., `${{ secrets.NPM_TOKEN }}`).
* **Security Recommendation**: No credentials or private keys have been committed. All active secret-handling references in GitHub Actions are properly parameterized using GitHub Secrets.

---

## 2. Stale Repository Links (Phase 4)

We detected multiple files containing stale links to the legacy repository path `github.com/imMamdouhaboammar/unslop` instead of the current `github.com/imMamdouhaboammar/unslop-preflight`:

* **`llms.txt`**: References `github.com/imMamdouhaboammar/unslop` and `skills.sh/imMamdouhaboammar/unslop`.
* **`PUBLISHING.md`**: References `imMamdouhaboammar/unslop` and `github.com/imMamdouhaboammar/unslop`.
* **`SOCIAL-KIT.md`**: Multiple draft tweet templates, Reddit posts, LinkedIn posts, and Hacker News articles contain references to `github.com/imMamdouhaboammar/unslop`.

---

## 3. Stale NPM / NPX Commands (Phase 3)

Direct quick-start examples in multiple documentation files incorrectly use `npx unslop autopilot` or direct `npx unslop <command>` syntax. Because `unslop` is a binary alias provided by installing `unslop-preflight`, running it directly via `npx` before local or global installation will fail to resolve.

* **Stale Direct Command Examples Found In**:
  * `README.md`
  * `SKILL.md`
  * `llms.txt`
  * `SOCIAL-KIT.md`
  * `PUBLISHING.md`
  * `docs/AI_AGENT_READINESS.md`
  * `docs/STANDARDS_PACKS.md`
  * `docs/VIBE_CODING_STANDARDS_PACK.md`
  * `scripts/autopilot.mjs`

---

## 4. Architectural and Root File Cleanup (Phases 5 & 6)

The root directory contains raw drafts and deployment details that do not fit a premium, clean open-source library surface:

* **`SOCIAL-KIT.md`**: Root file contains raw launch copy, first-person tweets, and unverified mock testimonials.
  * *Remedy*: Move to `marketing/SOCIAL-KIT.md` with an explicit draft copy disclaimer and reframe first-person claims as illustrative examples.
* **`PUBLISHING.md`**: Root file contains internal maintainer checklists.
  * *Remedy*: Move to `docs/PUBLISHING.md` as maintainer-only documentation and update completely to match `unslop-preflight` conventions.

---

## 5. npm Pack Dry-Run Analysis (Phase 11)

An inspection of `npm pack --dry-run` was performed:
* **Included Files of Note**: The package correctly packs `src/`, `bin/`, `assets/`, `docs/`, `references/`, `scripts/`, `evals/`, and essential markdown root files.
* **Safety & Cleanliness Improvement**:
  * Root `SOCIAL-KIT.md` and `PUBLISHING.md` must be removed from the root directory so they do not accidentally ship.
  * The newly relocated `marketing/` folder must be explicitly excluded in `.npmignore` to keep draft launch copy completely private.

---

## 6. GitHub Actions Publish Risk (Phase 10)

The workflow file `.github/workflows/npm-publish.yml` currently triggers on `push` events to the `main` branch.
* **Risk**: Merging pull requests to `main` could trigger OIDC/Oauth package publishes automatically or pollute logs.
* **Remedy**: Update trigger configuration to execute only on manual `workflow_dispatch` or push of version tags (`v*`).

---

## 7. Action Plan

We will systematically resolve all these findings through the remaining execution steps.
