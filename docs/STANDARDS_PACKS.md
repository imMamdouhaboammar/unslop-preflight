# Modular Standards Pack System (Profiles)

Unslop Preflight is designed to be lightweight, un-opinionated, and universally applicable by default. However, complex projects or enterprise teams often require strict engineering rules, architectural patterns, and strict security guidelines to maintain code quality across parallel AI-agent workflows.

To address this, Unslop supports a **Modular Standards Pack System** (Profiles). Standards Packs are optional, highly-opinionated, opt-in governance rules.

---

## Architecture Overview

Standards packs are registered under the `references/standards-packs/` folder in the project. Each standards pack is a self-contained directory containing metadata manifests and parsed rule documents.

```text
references/standards-packs/
  ├── [pack-id]/
  │     ├── manifest.json
  │     ├── README.md
  │     └── extracted/
  │           ├── architecture.json
  │           ├── security.json
  │           └── ...
```

- **Manifest**: Declares the pack's metadata, recommended environments, risk profiles, and rule categories.
- **Extracted Rules**: Clean, parsed JSON files containing detailed category-level rules, guidelines, and rationale.

---

## CLI Integration

Power users can leverage Standards Packs using the following CLI capabilities:

### 1. Registry Commands
- **List Available Packs**:
  ```bash
  npx unslop standards list
  ```
- **Inspect Specific Pack**:
  ```bash
  npx unslop standards inspect [pack-id]
  ```

### 2. Scanning & Auditing Flags
You can run any scanner or preflight audit enforcing a standards profile with the `--standards` option:
```bash
# Scan a directory against custom standards pack rules
npx unslop scan src --standards=vibe-coding

# Run full preflight autopilot and compile standard-aware reports
npx unslop autopilot --standards=vibe-coding
```

If an invalid or unrecognized standards pack ID is provided to `--standards`, the CLI will halt execution immediately with an exit code of `1` to prevent un-governed processes from running.

---

## Native Source-Level Scanners

To avoid executing fragile shell, Python, or external linter configurations during preflight runs, standard-specific source patterns are compiled into highly optimized, native JavaScript detectors in `src/scanners/standardsPackScanner.js`. 

These detectors support both:
1. **Regex Patterns**: For fast, high-confidence token and expression matches (e.g., catching `@ts-ignore` or hardcoded credentials).
2. **Heuristic Callbacks**: Custom logic executed per-file to evaluate complex contextual violations (e.g., verifying component file lengths or identifying prohibited cross-boundary imports).

---

## Report Compilation

When a standards pack is loaded during `unslop scan` or `unslop autopilot`:
- **Markdown Report (`.unslop/report.md`)**: Appends an `Enforced Standards:` tag in the Executive Summary.
- **Fix List (`.unslop/fix-list.md`)**: Instructs AI agents of the active standards profile and lists specific file-level violations.
- **JSON Report (`.unslop/report.json`)**: Appends `standards: "[pack-id]"` for machine auditing and CI/CD pipelines.
