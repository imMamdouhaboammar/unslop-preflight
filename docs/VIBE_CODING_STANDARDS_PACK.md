# Vibe Coding Standards Pack (vibe-coding)

The **Vibe Coding Standards Pack** (`vibe-coding`) represents a set of rigorous, high-governance engineering rules designed to keep fast-paced or AI-assisted frontend projects extremely clean, modular, and secure.

---

## Enabled Rules & Detectors

When `--standards=vibe-coding` is passed, the native source-level scanner enforces 5 custom quality gates:

### 1. No Cross-Layer Page Imports (`components-importing-pages`)
- **Severity**: `blocker` (Blocker / Error)
- **Rationale**: Pages represent the top-level, routed entry points of the application. Components inside `src/components/` must be generic, reusable, and independent. Importing a page directly inside a reusable component breaks unidirectional dependency flow and leads to severe circular dependencies.
- **Pattern Checked**: Flags any file containing `/components/` in its path that attempts to import from any path referencing `pages/` (e.g., `import ... from '@/pages/...'` or `import ... from '../pages/...'`).
- **Remediation**: Pass required data or callbacks into the component via `props`, or extract common elements into a shared component or a custom context.

### 2. Component Line Size Limit (`component-max-lines`)
- **Severity**: `warning` at >150 lines, `blocker` (Error) at >250 lines
- **Rationale**: Over-sized components are extremely hard to read, maintain, and test, and often indicate a violation of the Single Responsibility Principle (SRP). They are also a breeding ground for "AI slop" or duplicate elements during automated coding cycles.
- **Pattern Checked**: Measures the total line count of any React component file (`.jsx`, `.tsx`, `.js`, `.ts`) under `components/` or `src/components/`.
- **Remediation**: Decompose the component. Extract repeated markup blocks, long state handlers, or complex rendering structures into smaller sub-components, custom hooks, or utility files.

### 3. Centralized Storage Hygiene (`raw-local-storage-usage`)
- **Severity**: `warning`
- **Rationale**: Accessing `localStorage` or `sessionStorage` directly inside UI files scatters storage keys throughout the codebase, making schema versioning, hydration, and unit testing difficult.
- **Pattern Checked**: Flags any use of `localStorage` or `sessionStorage` (e.g., `.getItem()`, `.setItem()`) inside UI/React components.
- **Exclusions**: Completely ignores `storageManager.js`, `utils.js`, `config.js`, or any test files (`.test.js`, `.spec.ts`) to avoid false positives.
- **Remediation**: Centralize storage interaction inside a dedicated `storageManager` class or a custom hook, and use that service throughout your components.

### 4. Forbidden Type Escapes (`no-ts-ignore`)
- **Severity**: `blocker` (Blocker / Error)
- **Rationale**: Suppressing TypeScript compilation errors with `// @ts-ignore` bypasses type-safety entirely, allowing bugs to slip into production unnoticed.
- **Pattern Checked**: Flags any instance of `// @ts-ignore` comment blocks in the codebase.
- **Remediation**: Use proper types, type assertions, or generic signatures. If a library has broken types that cannot be resolved otherwise, use `// @ts-expect-error` instead with a detailed, descriptive comment justifying the escape.

### 5. Secrets Exposure Scan (`hardcoded-secret-keys`)
- **Severity**: `blocker` (Blocker / Error)
- **Rationale**: Committing API keys, private tokens, or credentials directly into a version-controlled repository presents a severe security and compliance vulnerability.
- **Pattern Checked**: Scans for common secret patterns (e.g., `apiKey: "..."`, `secret = "..."`, `jwt_secret: "..."`) with literal string values of length 16 or greater.
- **Exclusions**: Automatically ignores test files, mock folders, or fixture directories to ensure testing credentials do not trigger blockers.
- **Remediation**: Move all secret keys and credentials into secure environment variables (`.env`), or use a credential management system like Google Secret Manager.

---

## Running Vibe Coding Preflight

To enforce these rules on your project, simply run the audit or scan commands with the vibe-coding standards profile:

```bash
# Run a quick source-level scan
npx unslop-preflight scan --standards=vibe-coding

# Run a full autopilot preflight audit
npx unslop-preflight autopilot --standards=vibe-coding
```
