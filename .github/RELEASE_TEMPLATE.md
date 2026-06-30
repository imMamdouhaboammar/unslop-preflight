## Release summary

<!-- Describe the release in 2-4 concise bullets. Focus on user-visible changes. -->

- 
- 
- 

## Package

```text
Package: unslop-preflight
Version: v{{VERSION}}
npm: https://www.npmjs.com/package/unslop-preflight
GitHub: https://github.com/imMamdouhaboammar/unslop-preflight
```

## Highlights

### Added

- 

### Changed

- 

### Fixed

- 

## Verification

- [ ] `npm ci`
- [ ] `npm test`
- [ ] `npm pack --dry-run`
- [ ] `npx unslop --version`
- [ ] `npx unslop scan src --strict`

## Publishing checklist

- [ ] `package.json` version matches the release tag
- [ ] `package-lock.json` version matches `package.json`
- [ ] `CHANGELOG.md` includes this version
- [ ] GitHub release is published
- [ ] npm package is published or intentionally skipped because version already exists
- [ ] Skills.sh metadata still points to `unslop-preflight`

## Notes for users

Install or run directly:

```bash
npx unslop autopilot
npx unslop scan src --strict
```
