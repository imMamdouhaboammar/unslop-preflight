# CI Integration

Vibe Design MD Architect is designed to run in Continuous Integration (CI) environments as a quality gate for your design docs. This ensures that any changes to `PRODUCT.md` or `DESIGN.md` still adhere to your standards before they are merged.

## GitHub Actions Example

Create a file in your project at `.github/workflows/vibe-design.yml`:

```yaml
name: Vibe Design Quality Gates

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      
      # Assuming you have the tool installed as a devDependency
      - run: npm ci
      
      # Run the tool in strict CI mode
      - name: Run Vibe Design MD Architect Audit
        run: npx vibe-design-md-architect audit --ci
```

## Flags for CI

- `--ci`: Forces the tool to exit with a non-zero exit code (`1`) if any `error` level issues are found. Warnings and info-level issues will not fail the build unless `--strict` is used.
- `--strict`: Forces the tool to exit with a non-zero exit code if *any* issues are found (including warnings and info).
- `--json`: Prints a machine-readable JSON object instead of colored text output, useful if you are parsing the results for a custom dashboard or PR comment bot.
