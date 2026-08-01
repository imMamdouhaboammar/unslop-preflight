<div align="center">

# Unslop Preflight

<p align="center">
  <img src="https://raw.githubusercontent.com/imMamdouhaboammar/unslop-preflight/main/assets/readme/project-mark.svg" width="96" alt="Unslop Preflight Mark" />
</p>

**The ultimate preflight & autonomous repair guardrail for AI-built frontends.**

[![npm version](https://img.shields.io/npm/v/unslop-preflight?style=for-the-badge&color=5B21B6&logo=npm&logoColor=white)](https://www.npmjs.com/package/unslop-preflight)
[![npm downloads](https://img.shields.io/npm/dm/unslop-preflight?style=for-the-badge&color=5B21B6&logo=npm&logoColor=white&label=installs)](https://www.npmjs.com/package/unslop-preflight)
[![CI status](https://img.shields.io/github/actions/workflow/status/imMamdouhaboammar/unslop-preflight/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI&color=10B981)](https://github.com/imMamdouhaboammar/unslop-preflight/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-10B981?style=for-the-badge&logo=mit&logoColor=white)](./LICENSE)

[![Socket Supply Chain](https://img.shields.io/badge/supply%20chain-100%2F100-10B981?style=flat-square&logo=socket&logoColor=white)](https://socket.dev/npm/package/unslop-preflight)
[![skills.sh](https://img.shields.io/badge/skills.sh-published-0EA5E9?style=flat-square&logo=skillsdotsh&logoColor=white)](https://skills.sh/imMamdouhaboammar/unslop-preflight)

*Stop AI coding agents before they ship fragile, slop-ridden frontend layouts into production.*

---

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=imMamdouhaboammar&repo=unslop-preflight&theme=tokyonight&hide_border=true&bg_color=0D1117" alt="Unslop Preflight Repo Card" />
</p>
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=imMamdouhaboammar&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0D1117&count_private=true" alt="Mamdouh Abo Ammar GitHub Stats" width="48%" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=imMamdouhaboammar&layout=compact&theme=tokyonight&hide_border=true&bg_color=0D1117" alt="Top Languages" width="48%" />
</p>

</div>

## What is Unslop Preflight?

AI coding agents write frontend code 10x faster, but they also introduce fragile UI regressions 10x faster. When agents "vibe code" without strict guardrails, they often generate:

- **Clickable `<div>` elements**: Interactive components missing keyboard support and ARIA landmarks.
- **Blind `z-9999` patches**: Stacking-context bugs masked by extreme z-indexes.
- **Desktop-only modals**: Overlays that lock scrolling or clip content on mobile devices.
- **Performance killers**: Broad `transition: all` declarations that degrade Interaction to Next Paint (INP).
- **Prose slop**: AI-sounding filler copy (e.g., "delve", "foster").

**Unslop Preflight** is an automated quality gate and source-level repair engine. It enforces accessibility, layout sanity, and copy standards before AI-generated code is ever merged.

## Features: 7 Integrated Engines

Unslop Preflight unifies 7 open-source quality engines into one deterministic CLI:

1. **`no-ai-slop`**: Copy and prose refactoring.
2. **`loop-engineering`**: Continuous L1/L2 autonomous loops.
3. **`ui-review-loop`**: Visual browser UI testing and DOM timeline capture.
4. **`browser-use`**: Headless automation and viewport boundary testing.
5. **`make-interfaces-feel-better`**: 19 design engineering polish principles.
6. **`ui-skills`**: Baseline motion performance and interaction rules.
7. **`ux-ui-agent-skills`**: Design token governance and taste calibration.

## Quick Start

> [!NOTE]
> `bun` is highly recommended for executing Unslop Preflight within AI agent environments.

Run the instant preflight scan and auto-repair:

```bash
bunx unslop-preflight autopilot --safe-fix --verify
```

### Installation

```bash
# Using Bun (Recommended)
bun add -d unslop-preflight

# Using npm
npm install --save-dev unslop-preflight

# Using pnpm
pnpm add -D unslop-preflight
```

## CLI Commands

| Command | Description | Example |
|---|---|---|
| `autopilot` | Full preflight, source scan, repair, and verification. | `bunx unslop-preflight autopilot --safe-fix --verify` |
| `scan` | Scans source code, prose, interface feel, and a11y. | `bunx unslop-preflight scan src --strict` |
| `loop` | Continuous engineering loop runner (PR triage, CI sweep). | `bunx unslop-preflight loop status` |
| `review` | Browser UI review recorder (DOM, HAR, network). | `bunx unslop-preflight review start --url http://localhost:3000` |
| `init` | Bootstraps `PRODUCT.md`, `DESIGN.md`, and `AGENTS.md`. | `bunx unslop-preflight init` |
| `repair` | Executes safe, non-destructive AST transformations. | `bunx unslop-preflight repair --safe-fix` |
| `doctor` | Checks environment health and lockfile configuration. | `bunx unslop-preflight doctor` |

## Security & Supply Chain Defense

> [!IMPORTANT]
> Unslop Preflight is built with a zero-trust, secure-by-default architecture to prevent supply chain attacks, strictly adhering to npm security best practices.

- **Zero Postinstall Scripts**: Executes cleanly with `ignore-scripts=true`.
- **Lockfile Integrity**: Strictly validates package lockfiles (`package-lock.json`, `bun.lockb`, `pnpm-lock.yaml`) during the repair lifecycle to prevent injection.
- **OIDC Publishing**: Releases are signed via GitHub Actions OIDC with provenance attestations (`--provenance`).
- **Credential Scanning**: Embedded detectors proactively block hardcoded API keys and JWTs in source code before they ship.

## Agent Instructions

> [!TIP]
> Paste this into Claude Code, Cursor, or Gemini CLI to delegate the cleanup loop.

```text
You are my cleanup agent. Please run Unslop Preflight and fix the reported issues:

1. Detect the package manager (prefer Bun).
2. Run: `bunx unslop-preflight autopilot --safe-fix --verify --report --strict`
3. Read the reports in `.unslop/` (report.md, fix-list.md).
4. Address the findings:
   - Fix prose slop and AI-sounding copy.
   - Fix interface issues (transition: all, missing focus states).
   - Fix accessibility gaps (clickable divs, icon-only buttons).
   - Fix z-index and modal clipping bugs.
5. Re-run the autopilot command to verify the score delta.
6. Ensure all project checks (build, test, lint) pass cleanly.
```

## Repository Structure

```text
unslop-preflight/
├── .github/workflows/          # CI/CD & OIDC trusted npm publishing
├── bin/cli.js                  # CLI executable entry point
├── src/
│   ├── commands/               # CLI handlers (autopilot, scan, loop, review)
│   ├── core/                   # Engines (loopGate, reviewRecorder, safetyValidator)
│   ├── rules/                  # Gate rules (proseSlop, interfaceFeel, a11y)
│   └── scanners/               # Analyzers (browserAutomation, sourceSlop)
├── tests/                      # Unit & integration test runner suite
├── AGENTS.md                   # Agent guidance contract
├── SKILL.md                    # Universal skill manifest
└── package.json                # Project description & ESM manifest
```

<div align="center">

**Crafted with care to bring rigorous architectural discipline and gorgeous visual elegance to AI-driven frontend workflows.**

</div>
