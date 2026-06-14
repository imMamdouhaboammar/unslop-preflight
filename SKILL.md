---
name: unslop
description: Create, audit, repair, and score PRODUCT.md, DESIGN.md, and AGENTS.md before AI-assisted frontend implementation. Includes base UI gates, readiness bands, taste calibration, placeholder blocking, Root Cause Mode, modal viewport governance, stacking reasoning, install-agent-harness guidance, accessibility, RTL/LTR, token, privacy, and source-scan checks.
---

# Unslop

## Purpose

Use this skill before any AI coding agent starts interface work.

The skill creates and audits the product and design artifacts that should exist before frontend implementation:

- `PRODUCT.md`
- `DESIGN.md`
- `AGENTS.md`

The goal is to stop the agent from inventing vague product decisions, generic visual style, fragile accessibility behavior, weak responsive behavior, unsafe modals, broken overlays, fake data, hardcoded tokens, unresolved placeholders, symptom patches, and unnecessary tool installs.

This skill is useful for SaaS dashboards, admin panels, landing pages, product pages, bilingual RTL/LTR products, Arabic-first products, design-system preparation, UI redesigns, AI-generated frontend cleanup, and vibe-coded projects that need a safer agent setup.

Do not use it for backend-only tasks, database-only work, non-UI scripts, or projects where a mature design system already fully governs frontend implementation.

## Core principle

Do not let the coding agent start from a short prompt.

The agent should start from a clear product read, a specific design contract, a known design system direction, concrete taste controls, accessibility constraints, responsive rules, root-cause governance, overlay rules, install-agent-harness guidance, and implementation handoff instructions.

If those artifacts are missing, weak, or filled with placeholders, implementation is blocked.

## Required behavior

Before writing frontend code, do all of the following:

1. Classify the project mode.
2. Inspect existing `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, and `AGENT.md` when filesystem access exists.
3. Prefer `AGENTS.md` for new projects.
4. Respect an existing `AGENT.md` for backward compatibility, but do not create it for new projects unless explicitly requested.
5. Extract all inferable product, brand, UX, accessibility, localization, conversion, and implementation context before asking questions.
6. Ask only questions that materially affect the design or implementation handoff.
7. Create or update `PRODUCT.md`.
8. Create or update `DESIGN.md`.
9. Create or update `AGENTS.md` for AI coding agent guidance.
10. Run audit rules when tool access exists.
11. Repair only safe missing sections.
12. Write source-code fixes into a fix list instead of patching risky implementation details blindly.
13. Report score, readiness, category breakdown, and next action.
14. Block UI implementation when readiness is `blocked` or `needs-spec-work`.
15. For bug, layout, viewport, overlay, z-index, clipping, or regression work, require Root Cause Mode before any fix.
16. For vibe-coded projects, recommend only the missing agent skills or tools needed now. Do not bulk-install everything.

## Project modes

Classify each request as one of these modes:

| Mode | Use when |
|------|----------|
| `fresh-seed` | No trustworthy frontend or design artifacts exist yet |
| `existing-scan` | A repository exists and needs artifact extraction or audit |
| `redesign` | The UI exists but feels generic, inconsistent, or AI-made |
| `implementation` | Artifacts exist and the user wants frontend code |
| `audit` | The user asks for quality review or diagnosis |
| `amplify` | The user has an old, weak, incomplete, or generic `DESIGN.md` |
| `repair` | The user wants safe artifact fixes without broad rewrites |
| `root-cause-fix` | The user describes a broken UI, regression, clipping, viewport, z-index, or overlay issue |
| `harness-readiness` | The user needs help choosing project-specific agent skills, plugins, scanners, or runtime helpers |

If the mode is unclear, infer it and state the assumption briefly.

## Required project scan

When filesystem access exists, inspect:

- `PRODUCT.md`
- `DESIGN.md`
- `AGENTS.md`
- `AGENT.md`
- `package.json`
- frontend source directories such as `src/`, `app/`, `pages/`, `components/`
- style files such as `globals.css`, `index.css`, `theme.*`, `tokens.*`, and `tailwind.config.*`
- screenshots, logos, public assets, and reference images when available

Use `AGENTS.md` as the active instruction file unless only `AGENT.md` exists.

## PRODUCT.md contract

`PRODUCT.md` is the product and strategy context. It must not become a visual style guide.

It should include:

- product name
- product category
- core users
- user situation
- primary job to be done
- product promise
- emotional register
- brand traits
- what the product must never feel like
- UX risks
- accessibility needs
- localization needs
- writing tone
- anti-references
- success criteria
- assumptions
- design system baseline and fit rationale when known

Do not put colors, shadows, spacing scales, radii, or component styling in `PRODUCT.md`.

## DESIGN.md contract

`DESIGN.md` is the implementation-facing design contract.

It should include:

- Design Read
- Taste Controls
- Design System Decision
- visual direction
- color tokens
- typography scale
- spacing and density rules
- elevation and shadows
- component contracts
- responsive behavior
- accessibility rules
- directionality rules
- modal viewport contract
- overlay and feedback rules
- stacking context and z-index reasoning
- popup positioning strategy
- sensitive data display rules
- Root Cause Mode rules for broken UI work
- Install Agent Harness recommendations when relevant
- anti-AI-slop guidelines
- agent handoff
- pre-flight check

A weak `DESIGN.md` that only says modern, premium, clean, minimal, SaaS-like, or AI-powered is not implementation-ready.

## AGENTS.md contract

`AGENTS.md` tells AI coding agents how to work in the repository.

It should include:

- change-size policy
- files the agent must read before coding
- CLI commands to run
- testing expectations
- product/design constraints to preserve
- accessibility and privacy requirements
- readiness rules
- Root Cause Mode sequence
- Install Agent Harness sequence
- instruction to apply fix lists before implementation

New projects should use `AGENTS.md`. Existing projects with `AGENT.md` remain supported.

## Design System Baseline Gate

Before implementation, record a design system baseline.

Allowed values:

- `atlassian`
- `salesforce-lightning`
- `shopify-polaris`
- `material-design`
- `apple-human-interface`
- `custom-hybrid`

Guidance:

- Use Atlassian for collaboration, work management, issue tracking, documentation-heavy products, and admin tools.
- Use Salesforce Lightning for enterprise CRM, records, pipelines, approvals, and sales operations.
- Use Shopify Polaris for commerce, merchant tools, store admin, catalog, order, and checkout-adjacent workflows.
- Use Material Design for general-purpose apps, Android-first products, forms, and broad component vocabularies.
- Use Apple Human Interface Guidelines for native-feeling Apple ecosystem work.
- Use custom or hybrid for brand-led products, Arabic-first SaaS, B2G tools, AI workflow products, and cases where no public system fits.

The baseline guides structure and behavior. It must not copy another company's brand skin.

## Taste calibration

Every serious `DESIGN.md` should include a taste layer.

### Design Read

The agent should write a short interpretation of:

- what the product is
- who it is for
- what the interface must make clear
- what tension the design must solve
- what the design must avoid

### Taste Controls

Use three dials, each from 1 to 10:

| Dial | Meaning |
|------|---------|
| `DESIGN_VARIANCE` | How far the visual direction can move from standard component defaults |
| `MOTION_INTENSITY` | How much motion is appropriate |
| `VISUAL_DENSITY` | How much information the interface can carry per screen |

Invalid or missing dial values block readiness.

### Design System Decision

Document the selected baseline, why it fits, and what must be adapted for the product.

### Anti-AI-Slop Guidelines

Ban generic defaults that do not serve the product, such as:

- purple-blue gradient identity by default
- dark cyber SaaS look by default
- sparkle or magic wand icons as a generic AI metaphor
- equal three-card feature grids without hierarchy
- glass cards everywhere
- default font choices with no rationale
- vague adjectives instead of design decisions

## Root Cause Mode

When a request mentions a bug, issue, broken UI, regression, overflow, clipping, z-index, viewport, modal, popup, drawer, dropdown, tooltip, toast, focus trap, or layout failure, the agent must diagnose before editing.

Required sequence:

1. Reproduce or restate the failing state.
2. Separate visible symptoms from the underlying cause.
3. Identify the smallest root fix.
4. Check nearby regressions.
5. Provide verification proof.

Do not accept quick fixes, workarounds, magic numbers, forced dimensions, `z-9999`, `z-index: 9999`, or broad rewrites without diagnosis.

## Modal viewport and overlay governance

When `DESIGN.md` mentions a modal, dialog, popup, drawer, sheet, overlay, lightbox, popover, toast, or command palette, the design must include:

- viewport contract
- width guard
- height guard
- internal scroll behavior
- mobile behavior
- QA proof for small viewports, landscape, keyboard-open state, no clipping, and no horizontal overflow

## Stacking and z-index reasoning

Layered UI must include:

- placement plan
- stacking context audit
- layer scale
- portal policy
- conflict matrix

Do not treat overlay problems as number-only problems. Raising z-index without root-cause diagnosis is a symptom patch.

## Install Agent Harness

Before implementation, the agent should inspect the project and recommend only the missing skills and tools needed now.

Required output:

- active host: Claude Code, Codex, Cursor, Gemini CLI, Copilot, Antigravity, OpenCode, Windsurf, or another host
- project shape: static page, React app, Next app, dashboard, design-system work, migration, refactor, or bug fix
- risk profile: runtime errors, duplicate code, missing tests, weak design spec, large-codebase navigation, UI quality, external app integration
- recommendation priority: required now, recommended now, optional later, or skip
- reason for this project now
- setup method or command after source review
- verification and rollback notes

Do not bulk-install every skill or tool. Extra skills add context overhead and can introduce conflicting guidance.

## Placeholder policy

Unresolved placeholders are blockers.

Block implementation when `PRODUCT.md` or `DESIGN.md` contains unresolved patterns such as:

- `[audience]`
- `[Feature 1]`
- `[product name]`
- `TODO`
- `TBD`
- `...`
- obvious template-only filler

Starter templates can contain placeholders. Implementation handoff files cannot.

## Readiness bands

The audit should map score and blockers into a readiness decision.

| Readiness | Meaning | Action |
|-----------|---------|--------|
| `blocked` | Critical blockers remain | Do not implement |
| `needs-spec-work` | Artifacts exist but are too vague | Repair or rewrite docs first |
| `agent-ready-with-fix-list` | Mostly ready, but fix-list items remain | Apply fix list, rerun audit |
| `agent-ready` | Specific enough for implementation | Proceed with the coding agent |

Always report the readiness band and the next action.

## Category breakdown

Reports should group issues by practical category, including:

- product clarity
- design contract
- taste calibration
- placeholders
- agent guidance
- root cause governance
- install agent harness
- accessibility
- responsive behavior
- viewport governance
- modal and overlay governance
- stacking and z-index reasoning
- popup positioning
- sensitive data display
- security and privacy
- implementation scan

Use category breakdowns to tell the user where to focus first.

## Base gates and readiness layer

The original 23 numbered gates still define the core UI governance system:

1. Design System Baseline
2. Intake Session
3. Standards Search
4. Unslop Install
5. PRODUCT.md
6. DESIGN.md Contract
7. Rules Engine
8. Accessibility and Directionality
9. UX-CRX Logic
10. Mobile and Responsive
11. Popup and Feedback System
12. Implementation Scan
13. Amplify Preservation
14. Semantic HTML and Interaction
15. Realistic Content
16. Design Tokens
17. Drift Control
18. Viewport Governance
19. Modal and Dialog
20. Dashboard Shell
21. Overlay Stack
22. Sensitive Data Display
23. Popup and Floating Positioning

The readiness layer adds v1.9.8 docs

- Strict Gates Enforcement: All warnings and info rules are now elevated to errors.
- AGENTS.md support across init, audit, repair, reports, and package publishing
- readiness bands and category scoring
- taste calibration rules
- placeholder gates for product and design artifacts
- Root Cause Mode for bug and layout work
- strict modal viewport and overlay sizing gates
- stacking context, portal policy, and z-index reasoning gates
- Install Agent Harness recommendations with bulk-install guard expectations

## Source scanner expectations

When source exists, scan for:

- clickable non-interactive elements
- native `alert()` or `confirm()` in product flows
- fake content
- exposed API keys or tokens
- root `overflow: hidden`
- hardcoded colors
- generic gradients
- missing landmarks
- missing labels
- icon-only buttons without accessible names
- modals without accessible names or focus behavior
- dropdowns without collision handling
- tooltips or overlays without z-index tokens
- blind z-index escalation
- overlay viewport overflow risk

Source issues that cannot be safely auto-fixed should be written into a fix list for the coding agent.

## Repair policy

Repair should be safe and narrow.

Allowed repairs:

- create missing `PRODUCT.md`, `DESIGN.md`, or `AGENTS.md`
- add missing required sections
- add missing checklists
- add missing template blocks
- write fix-list instructions
- add report output

Avoid destructive repairs:

- do not rewrite a complete product strategy without preserving useful decisions
- do not delete user decisions casually
- do not patch source code broadly without user review
- do not convert warning-level design preferences into arbitrary new brand decisions

## Amplify Mode

Use Amplify Mode when the user has an old or weak `DESIGN.md` and wants it strengthened.

Amplify Mode should:

1. Read the old design file completely.
2. Preserve product-specific decisions that are useful.
3. Remove weak generic language.
4. Add missing taste, accessibility, responsive, modal, overlay, popup, token, root-cause, harness, and handoff rules.
5. Convert loose notes into a stronger `DESIGN.md` contract.
6. Produce an explanation of what changed and why.
7. Re-audit the result.

## Recommended commands

Use these commands when available:

```bash
npx unslop init
npx unslop audit --verbose
npx unslop repair --dry-run --report
npx unslop autopilot
```

For source scans:

```bash
npx unslop scan src/
npx unslop scan:a11y src/
npx unslop scan:viewport http://localhost:3000
```

For tests in this repository:

```bash
npm test
```

## Reporting contract

A useful report should include:

- score
- readiness band
- category breakdown
- blocker list
- safe repair summary
- source fix list when present
- exact next command
- exact files the coding agent must read next

The report should tell the user whether implementation is allowed, not just list warnings.

## Recommended implementation handoff

When the project becomes ready, give the coding agent this instruction:

```text
Read PRODUCT.md, DESIGN.md, and AGENTS.md before writing UI code. Preserve the Design Read, Taste Controls, Design System Decision, accessibility rules, responsive rules, Root Cause Mode, modal viewport rules, overlay and stacking rules, popup positioning strategy, token rules, sensitive data rules, and Install Agent Harness recommendations. Apply every item in the generated fix list before final output. Do not invent product, brand, or visual decisions that are not present in the artifacts.
```

## Documentation sync rule

When behavior changes, update all relevant docs in the same change:

- `README.md`
- `CHANGELOG.md`
- `SKILL.md`
- `AGENTS.md`
- `CONTRIBUTING.md`
- `docs/AI_AGENT_READINESS.md`
- `docs/ROOT_CAUSE_MODE.md`
- `docs/OVERLAY_LAYERING_GATES.md`
- `docs/INSTALL_AGENT_HARNESS.md`
- package metadata when published files change

Documentation is part of the system contract. Stale docs cause agents to follow the wrong behavior.
