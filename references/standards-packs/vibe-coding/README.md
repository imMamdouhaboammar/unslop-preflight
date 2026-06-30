# Vibe Coding Standards Pack

This standards pack provides high-governance frontend engineering rules extracted from the `vibe-coding-standards-skill` repository. It is designed to act as an optional, opt-in quality gate for React and TypeScript codebases.

## Overview

The Vibe Coding Standards Pack enforces rigorous practices in modularity, type safety, dependency flow, security, and accessibility. By configuring your preflight checks with this standards pack, you run highly specialized local scanning and auditing that goes beyond default clean code requirements.

## Rule Categories

The standards pack is divided into six core modules located under the `extracted/` folder:

1. **Architecture (`architecture.json`)**: Enforces strict unidirectional dependencies.
   - Pages must only import from components, hooks, engine, utils, types, or constants.
   - Components must not import from pages.
   - Low-level elements (engine, hooks, utils, types, constants) must not import upwards.

2. **Security & Privacy (`security.json`)**: Secure-by-default rules.
   - Prompts for private APIs and logged-out/authenticated states.
   - Encourages state management abstraction rather than direct raw storage inside components.
   - Prevents hardcoded secret keys or API tokens.

3. **Component Modularity (`component-modularity.json`)**: Eliminates monolithic "God Components".
   - Enforces Single Responsibility Principle (SRP).
   - Sets strict line-of-code thresholds on UI files (Warning > 150 lines, Error > 250 lines).
   - Discourages overusing multiple `useEffect` hooks in a single component.

4. **Type System (`type-system.json`)**: Restricts type duplication.
   - Mandates a Single Source of Truth (SSOT) under `src/types/index.ts`.
   - Restricts imports to centralized files to avoid cross-module loops.

5. **Testing & QA (`testing.json`)**: Standardized coverage metrics.
   - Requires business logic and hooks coverage with Vitest.
   - Prompts for component behavioral integration tests.
   - Enforces a default 80% line coverage gate for new code.

6. **Accessibility (`accessibility.json`)**: Standard a11y standards.
   - Semantic HTML (avoiding generic divs for clickable elements).
   - Keyboard navigability (focus states).
   - Explicit `alt` labels for images and ARIA usage for dynamic widgets.

## Usage

Enable this standards pack in your `unslop` execution using the `--standards` option:

```bash
unslop scan src --standards=vibe-coding
unslop audit --standards=vibe-coding
unslop autopilot --standards=vibe-coding
```
