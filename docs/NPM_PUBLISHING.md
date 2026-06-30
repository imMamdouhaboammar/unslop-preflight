# npm Publishing

This repository is configured to publish `unslop-preflight` to npm from GitHub Actions.

## Current release package

```text
Package: unslop-preflight
Repository: imMamdouhaboammar/unslop-preflight
Workflow: .github/workflows/npm-publish.yml
Current package version: 1.10.1
```

## Recommended setup: npm Trusted Publishing

Use npm Trusted Publishing instead of a long-lived npm token when possible.

In npm package settings, configure a trusted publisher with:

```text
Provider: GitHub Actions
Owner: imMamdouhaboammar
Repository: unslop-preflight
Workflow filename: npm-publish.yml
Allowed action: npm publish
```

The workflow grants `id-token: write`, which lets npm authenticate the GitHub Actions run through OIDC.

## Workflow behavior

The publish workflow runs on:

- manual `workflow_dispatch`
- push to `main` when package-relevant files change
- tag pushes matching `v*`

Before publishing, it:

1. checks out the repository
2. installs Node.js 24
3. runs `npm ci`
4. runs `npm test`
5. runs `npm pack --dry-run`
6. verifies that a `v*` tag matches `package.json` when running from a tag
7. checks whether `name@version` already exists on npm
8. runs `npm publish --provenance --access public` only when the version is not already published

This prevents repeated failed publishes when `main` changes but the package version has already been released.

## Token fallback

The workflow keeps `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` as a fallback.

If Trusted Publishing is not configured yet, add a repository secret named `NPM_TOKEN` with npm publish permission.

Trusted Publishing is still preferred because it avoids long-lived publish tokens.

## Release checklist

1. Update `package.json` version.
2. Update `package-lock.json` version.
3. Update README badges and current-version docs.
4. Update `CHANGELOG.md`.
5. Commit to `main`.
6. Let the workflow run, or create a matching tag:

```bash
git tag v1.10.1
git push origin v1.10.1
```

## Mismatch prevention

The repository should keep these aligned:

| File | Field |
|------|-------|
| `package.json` | `name`, `version`, `repository`, `homepage`, `bugs`, `bin`, `files` |
| `package-lock.json` | root `name` and `version` |
| `README.md` | package version badges and install command |
| `SKILL.md` | Skills.sh skill slug |
| `skills.sh.json` | Skills.sh grouping slug |
| `.github/workflows/npm-publish.yml` | workflow filename configured in npm trusted publisher |

If npm already has the same package version, the workflow skips publish. Bump a patch version when GitHub has publishable changes that npm has not received.
