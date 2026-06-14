# Publishing checklist for skills.sh

## 1. Create the GitHub repository

Recommended repository name:

```text
unslop
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

`SKILL.md` must stay at the repository root, unless you intentionally move the skill into `skills/unslop/SKILL.md`.

## 3. Verify metadata

The top of `SKILL.md` must include valid YAML frontmatter:

```yaml
---
name: unslop
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

Replace `imMamdouhaboammar/unslop` with your GitHub repository path:

```bash
npx skills add imMamdouhaboammar/unslop
```

Or test the specific skill:

```bash
npx skills add https://github.com/imMamdouhaboammar/unslop --skill unslop
```

## 6. Wait for skills.sh discovery

skills.sh lists repositories automatically after the repository is seen through `npx skills add`. Repo page changes can be cached, so the public page may not update instantly.

Expected public URL shape:

```text
https://skills.sh/imMamdouhaboammar/unslop/unslop
```

## 7. Suggested launch copy

```text
I published Unslop, a skill for agents that keeps UI work from starting too early. It creates and repairs PRODUCT.md and DESIGN.md, asks the right design-system baseline question first, adds standards checks, installs Unslop when possible, and blocks generic AI-looking frontend before implementation.
```
