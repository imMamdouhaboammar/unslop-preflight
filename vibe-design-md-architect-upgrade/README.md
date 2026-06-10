# vibe-design-md-architect

> A pre-agent quality gate for AI-assisted frontend work.

![npm](https://img.shields.io/npm/v/vibe-design-md-architect)
![license](https://img.shields.io/npm/l/vibe-design-md-architect)
![CI](https://github.com/imMamdouhaboammar/vibe-design-md-architect/actions/workflows/ci.yml/badge.svg)

Run it before Cursor, Claude Code, AI Studio, Bolt, Windsurf, or any other coding agent starts editing your app. 

It ensures a strict design and product contract exists before the AI writes a single line of code.

```bash
npx vibe-design-md-architect autopilot
```

It creates or checks `PRODUCT.md`, `DESIGN.md`, and `AGENT.md`, then runs quality gates that catch weak specs, missing UX states, accessibility gaps, mobile layout risks, security display issues, and regression-prone agent instructions.

## The Problem

AI coding agents often fail because the handoff is vague. If you just ask an agent to "build a dashboard," they might:
- Redesign things you did not ask for.
- Remove features.
- Miss mobile states.
- Expose tokens in plaintext in the DOM.
- Build modals without focus management. 

This tool puts a strong design and product contract in front of the agent to eliminate those issues.

## Quick Start

```bash
# Run the full suite (create files, audit, auto-repair, and report)
npx vibe-design-md-architect autopilot --report
```

Then review the generated `.vibe-design/fix-list.md` for any manual fixes needed.

When you're ready, give your AI coding agent this exact prompt:
> Inspect PRODUCT.md, DESIGN.md, and AGENT.md. Read `.vibe-design/fix-list.md` and resolve any listed issues. Implement the requested scope while preserving existing behavior. **MANDATORY**: Before you complete this task, you MUST run `npx vibe-design-md-architect audit` in the terminal, ensure there are 0 errors, and show me the final output score.

## Commands

```bash
vibe-design-md-architect init       # Creates missing artifact files with high-quality templates
vibe-design-md-architect audit      # Evaluates artifacts against quality gates without modifying
vibe-design-md-architect repair     # Safely injects missing checklists and standard rules
vibe-design-md-architect report     # Writes a structured report file (.vibe-design/report.md)
vibe-design-md-architect doctor     # Checks environment and project assumptions
vibe-design-md-architect autopilot  # Runs init + audit + repair + report all at once
```

## Flags

- `--dry-run`: Preview changes without writing to disk
- `--json`: Output machine-readable JSON format
- `--report`: Write `.vibe-design` output reports
- `--ci`: Exit non-zero on errors (perfect for GitHub Actions)
- `--strict`: Exit non-zero on *any* issue (including warnings)
- `--verbose`: Show extended output details
- `--no-color`: Disable colored terminal output

## Quality Gates

The rule engine runs strict checks across 10 categories. Some examples include:
- **Product Clarity**: Missing target users or acceptance criteria.
- **UX Completeness**: Missing loading, empty, and error states.
- **Accessibility**: Modals without focus traps, missing keyboard navigation.
- **Responsive Design**: `height: 100vh` mobile risk without a safe viewport caveat.
- **Security & Privacy**: Token/API key display without masking guidelines.
- **Regression Guard**: Missing "do-not-break" rules in `AGENT.md`.
- **Content Quality**: Rejects vague phrases like "make it modern" or "beautiful UI" in favor of strict requirements.

For the full list of rules, see [docs/rules.md](./docs/rules.md).

## Safe Repair Policy

Auto-repair is deterministic and non-destructive. It only:
- Appends safe missing sections or checklists.
- Creates missing artifact files using robust templates.

It will **never**:
- Invent business claims.
- Overwrite your custom content.
- Remove existing sections.
- Change application source code.

## Documentation

- [Agent Workflow Guide](./docs/agent-workflow.md)
- [List of Quality Gates](./docs/rules.md)
- [CI Integration Guide](./docs/ci.md)
- [Contributing](./CONTRIBUTING.md)

## CI Integration

Add to your GitHub Actions to block bad AI instructions from being merged:

```bash
npx vibe-design-md-architect audit --ci
```

## License

MIT © Mamdouh Aboammar
