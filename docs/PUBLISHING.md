# Maintainer Publishing Guide

> [!IMPORTANT]
> This guide is for maintainers only.

## 1. Create the GitHub repository

Recommended repository name:

```text
unslop-preflight
```

Make the repository public if you want it to appear on skills.sh.

## 2. Push the skill files

The repository root should contain:

```text
SKILL.md
README.md
CHANGELOG.md
skills.sh.json
references/
assets/
scripts/
evals/
```

`SKILL.md` must stay at the repository root, unless you intentionally move the skill into `skills/unslop-preflight/SKILL.md`.

## 3. Verify metadata

The top of `SKILL.md` must include valid YAML frontmatter:

```yaml
---
name: unslop-preflight
description: Create, audit, and repair PRODUCT.md and DESIGN.md before UI implementation for SaaS, dashboards, landing pages, and RTL/LTR web apps.
---
```

## 4. Run local checks

```bash
node scripts/run-evals.mjs
node scripts/intake-session.mjs INTAKE.session.md
node scripts/standards-search-brief.mjs PRODUCT.md DESIGN.md
```

The scripts that validate `DESIGN.md` need real generated artifacts, so run them inside a test project after the skill creates `PRODUCT.md` and `DESIGN.md`.

Optional viewport scan requires Playwright:

```bash
npm install
npx playwright install chromium
node scripts/scan-viewport-fit.mjs http://localhost:3000
```

## 5. Test installation through skills CLI

Replace `imMamdouhaboammar/unslop-preflight` with your GitHub repository path:

```bash
npx skills add imMamdouhaboammar/unslop-preflight
```

Or test the specific skill:

```bash
npx skills add https://github.com/imMamdouhaboammar/unslop-preflight --skill unslop-preflight
```

## 6. Wait for skills.sh discovery

skills.sh lists repositories automatically after the repository is seen through `npx skills add`. Repo page changes can be cached, so the public page may not update instantly.

Expected public URL shape:

```text
https://skills.sh/imMamdouhaboammar/unslop-preflight/unslop-preflight
```

## 7. Suggested launch copy

```text
I published unslop-preflight, a skill for agents that keeps UI work from starting too early. It creates and repairs PRODUCT.md and DESIGN.md, asks the right design-system baseline question first, adds standards checks, installs Unslop when possible, and blocks generic AI-looking frontend before implementation.
```

## 8. Publishing to npm (Maintainers Only)

Before publishing, perform a dry run to verify the contents of the package and ensure no secrets or unnecessary files are included.

### Dry-Run Verification

Run the following command to package the project and inspect the files that will be published:

```bash
npm pack --dry-run
```

Verify that only the intended files (e.g., `src/`, `bin/`, `scripts/`, `assets/`, `SKILL.md`, etc.) are included and that no configuration files containing secrets, personal notes, or temp directories are present in the list of files.

### Release Checklist & Safety Warnings

- **No Dirty Working Tree:** Never publish from a dirty Git working tree. Run `git status` to ensure all changes are committed.
- **Verify Packed Contents:** Inspect the dry-run output closely.
- **No Secrets:** Ensure that you do not commit, pack, or publish any API keys, tokens, or other credentials. Check `.npmignore` to verify that sensitive files are ignored.
- **Run the Evals and Tests:** Confirm all checks in Section 4 are passing.
- **Publish Command:** Once everything is verified, publish the package:
  ```bash
  npm publish
  ```
