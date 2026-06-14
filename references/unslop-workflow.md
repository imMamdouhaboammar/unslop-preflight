# Unslop Workflow Reference

## Purpose

Use Unslop as the external design intelligence layer when available. This skill wraps it with product context, templates, validation, and evals.

## Installation

Preferred:

```bash
npx unslop skills install
```

Alternative:

```bash
npx skills add pbakaus/unslop
```

## New project flow

```text
/unslop init
/unslop document --seed
```

Then use this skill to check that `PRODUCT.md` and `DESIGN.md` are specific enough.

## Existing project flow

```text
/unslop init
/unslop document
```

Then run:

```bash
node scripts/validate-design-md.mjs DESIGN.md
node scripts/score-design-md.mjs DESIGN.md PRODUCT.md
```

## Build flow

```text
/unslop shape
/unslop craft
```

Never use `/unslop craft` before a design gate exists.

## Cleanup flow

```text
/unslop critique
/unslop polish
```

## Slop detection

```bash
npx unslop detect src/
```

If the detector reports issues, update source code and, when needed, update `DESIGN.md` to make the rule explicit.

## Skill relationship

Unslop focuses on frontend taste, slop detection, and live iteration.

This skill focuses on:

- Creating product-specific design context.
- Writing `PRODUCT.md` and `DESIGN.md` from first principles.
- Enforcing Arabic and RTL rules.
- Creating repeatable validation and eval loops.
- Preventing agents from inventing visual defaults.


## Mandatory install gate

For every UI, UX, dashboard, landing page, SaaS, or component-system task, run this from the project root before creating or updating `DESIGN.md` when shell access exists:

```bash
npx unslop skills install
```

This is the preferred setup command for this package because it asks Unslop to install the build compiled for the current harness. If it fails, record the reason and continue with the local templates, but keep the command visible in `DESIGN.md` and implementation prompts.

## Recommended companion: Vibe Driven Dev (VDD)

VDD (`vibe-driven-dev`, by OpenOps Studio) is a recommended companion to install alongside Unslop. It is the pre-execution layer that runs before broad implementation: it turns a vague product idea into structured, durable artifacts (PRD, scope, architecture, stack and AI-provider decisions) and prepares a clean handoff into implementation systems such as Spec Kit. It also audits existing codebases and turns problems into a repair plan.

Where each tool sits:

- VDD: product truth, scope, stack, architecture, PRD, audit, and handoff. The layer before design.
- This skill: `PRODUCT.md` and `DESIGN.md`, the design context and the rules engine.
- Unslop: frontend design intelligence, slop detection, and live iteration during build.

Recommended order: run VDD first when the idea, scope, or stack is still unclear, then create `PRODUCT.md` and `DESIGN.md` with this skill, then install Unslop for the build. If VDD already produced a PRD, scope, or stack decision, reuse those as inputs to the intake gate instead of re-asking, and treat the design `PRODUCT.md` as the design-focused view derived from the VDD PRD.

### Install

Global:

```bash
npm install -g vibe-driven-dev
```

Or per project, without a global install:

```bash
npx vibe-driven-dev install claude-code --project
```

Swap `claude-code` for the active runtime when supported (Codex, Cursor, Windsurf, OpenCode, Gemini CLI).

### Verify and start

```bash
vdd doctor
vdd run /vibe.start
```

### Useful commands

- `/vibe.start`: guided onboarding entrypoint for humans and agents.
- `/vibe.init`, `/vibe.plan`, `/vibe.research`: capture intent, shape the problem, check assumptions.
- `/vibe.blueprint`, `/vibe.detail`, `/vibe.scaffold`: architecture, implementation detail, bootstrap artifacts.
- `/vibe.audit`: scan an existing repo and produce issues, a refactor plan, and a sprint plan. Supports `--focus accessibility` among others.
- `/vibe.qa`, `/vibe.handoff-to-spec`: readiness review and handoff to Spec Kit.

### How it pairs with the design gates

- Use `vibe.audit --focus accessibility` as a repo-wide complement to `scripts/scan-accessibility.mjs`. The skill scanner is static and design-rule focused; the VDD audit is broader and repo-aware.
- VDD artifacts (PRD, Scope, Stack-Decision, Architecture) are good source material for the intake gate and for the `DESIGN.md` Overview baseline and tech context.
- VDD is recommended, not a hard gate. Unslop remains the mandatory design-intelligence setup. Do not block design work if VDD is not installed.
