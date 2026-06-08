<div align="center">

# Vibe Design MD Architect

### Stop your AI from building generic UI slop.

**23 hard-blocking design gates** that run before your agent writes a single line of frontend code.

[![npm](https://img.shields.io/npm/v/vibe-design-md-architect?style=flat-square&color=5B21B6&label=npm)](https://www.npmjs.com/package/vibe-design-md-architect)
[![skills.sh](https://img.shields.io/badge/skills.sh-install-5B21B6?style=flat-square)](https://skills.sh/imMamdouhaboammar/vibe-design-md-architect/vibe-design-md-architect)
[![Gates](https://img.shields.io/badge/gates-23-F59E0B?style=flat-square)](./SKILL.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-22C55E?style=flat-square)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.8.0-3B82F6?style=flat-square)](./CHANGELOG.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-EC4899?style=flat-square)](./CONTRIBUTING.md)

```bash
npx vibe-design-md-architect autopilot
```
> **That's it.** One command bootstraps your DESIGN.md, runs all 23 gates, auto-repairs every failure, and tells you exactly what needs a human fix. Then you run it again and everything passes.

[**Autopilot**](#-autopilot-the-one-command-agentic-loop) · [**Quick Start**](#-quick-start) · [**CLI**](#%EF%B8%8F-cli-reference) · [**What it blocks**](#-what-it-blocks) · [**All 23 Gates**](#-23-hard-blocking-gates) · [**Changelog**](./CHANGELOG.md)

</div>

---

## The problem

AI coding agents skip design. Every time.

They pick purple-to-blue gradients. They use `Inter` by default. They stack feature cards with identical rounded corners. They forget RTL. They ignore accessibility. They ship `alert()`. They create 500px modals on 568px screens.

Then you spend hours fixing something that looked fine in the first screenshot.

**Vibe Design MD Architect blocks all of that — before the first line of CSS is written.**

---

## How it works

```
Your prompt
   ↓
Design System Baseline Gate    ← First mandatory question
   ↓
Intake Session Gate             ← Product context, user, job, localization
   ↓
2026 Standards Search Gate      ← WCAG 2.2, MDN Baseline, web.dev, framework docs
   ↓
Impeccable Install Gate         ← npx impeccable skills install
   ↓
PRODUCT.md Gate                 ← Product strategy artifact created and validated
   ↓
DESIGN.md Gate (6 sections)     ← Colors, Typography, Elevation, Components, Rules
   ↓
Anti-AI-Slop Visual Gate        ← No purple gradients, no sparkle icons, no fake cards
   ↓
Accessibility + Directionality  ← WCAG AA contrast, keyboard, RTL/LTR, ARIA
   ↓
Viewport + Modal + Overlay      ← scroll governance, focus trapping, z-index tokens
   ↓
Popup Positioning Gate          ← flip/shift/size middleware, portal mounting (Gate 23)
   ↓
IMPLEMENTATION ALLOWED ✓
```

---

## 🤖 Autopilot — the one-command agentic loop

```bash
npx vdma autopilot
```

The autopilot runs every gate in sequence, auto-repairs every failure it can fix, and repeats until everything passes. You only need one command.

### What it does per pass

```
Pass 1
 [ 1/9]  Impeccable setup          → attempts npx impeccable skills install
 [ 2/9]  Bootstrap artifacts       → creates DESIGN.md + PRODUCT.md if missing
 [ 3/9]  Repair DESIGN.md          → patches missing sections + required fields
 [ 4/9]  Validate DESIGN.md        → checks six-section contract → repairs + retries
 [ 5/9]  Score DESIGN.md           → checks quality score → repairs if below threshold
 [ 6/9]  Run 23 gates              → runs all gates → repairs DESIGN.md failures → retries
 [ 7/9]  Scan UI implementation    → scans src/ for slop + accessibility blockers
 [ 8/9]  Scan accessibility        → WCAG 2.2 audit on src/
 [ 9/9]  Intake + standards brief  → scaffolds INTAKE.session.md (first pass only)

Repairs applied → Pass 2 → …

✓ All gates pass. Implementation unblocked.
```

### What gets auto-repaired (DESIGN.md)

| What's missing | What autopilot adds |
|----------------|-------------------|
| Any of the 6 required sections | Injects full template section |
| Impeccable setup gate | Injects gate + command under Overview |
| Creative North Star | Injects placeholder under Overview |
| Color token table | Injects 10-token semantic color scale |
| Viewport Contract table | Injects 4-row route governance table |
| Modal / Drawer contract | Injects full modal contract |
| Z-index token scale | Injects `--z-sticky` to `--z-top` CSS |
| Popup positioning strategy | Injects Strategy B (Floating UI) pattern |
| Typography scale | Injects 9-row type scale table |
| Overlay system declaration | Injects toast/overlay system rules |
| Missing PRODUCT.md | Creates from template |

### Source fixes → VDMA-FIXES.md

Issues in your source code can't be auto-patched safely. Instead, autopilot writes `VDMA-FIXES.md`:

```
VDMA-FIXES.md
→ [BLOCKER] src/components/Dropdown.jsx:42 — clickable <div> instead of <button>
→ [BLOCKER] src/pages/Login.jsx:11 — height: 100vh without dvh fallback
→ [a11y] src/components/Nav.jsx:8 — <nav> missing aria-label
```

Then just tell your coding agent:
```
Apply all fixes listed in VDMA-FIXES.md, then run: npx vdma autopilot
```

The agent applies the fixes, you run autopilot again, everything passes.

### Options

```bash
npx vdma autopilot --max-passes=5      # More passes for complex projects
npx vdma autopilot --no-source-scan    # Skip source scanning (DESIGN.md only)
npx vdma autopilot --no-impeccable     # Skip Impeccable install attempt
npx vdma autopilot --dry-run           # Show what would run without doing it
```

---

## ⚡ Quick Start

**Option A — npx (no install required):**
```bash
npx vibe-design-md-architect init
npx vibe-design-md-architect preflight
```

**Option B — Install globally (Claude Code / Terminal):**
```bash
npm install -g vibe-design-md-architect
```

**Option C — Install as a Claude Skill:**
```bash
npx skills add https://github.com/imMamdouhaboammar/vibe-design-md-architect --skill vibe-design-md-architect
```
*Or shorthand:*
```bash
npx skills add imMamdouhaboammar/vibe-design-md-architect
```

**Option D — Install into your project:**
```bash
npm install --save-dev vibe-design-md-architect
npx vdma preflight
```

```

**Option D — Copy into Claude skills folder:**
```bash
# Project-level
mkdir -p .claude/skills
cp -R node_modules/vibe-design-md-architect .claude/skills/

# User-level (all projects)
npx vdma init --global
```

---

## 🖥️ CLI Reference

```
npx vibe-design-md-architect <command> [args]
```

| Command | What it does |
|---------|-------------|
| `autopilot` | **🤖 THE command** — repair loop → all 23 gates → VDMA-FIXES.md `[--max-passes=3]` |
| `init` | Install skill into `.claude/skills/` (project) or `~/.claude/skills/` (global) |
| `preflight` | **Step-by-step**: Impeccable → intake → standards → validate → gates → scan |
| `repair` | Auto-repair DESIGN.md + PRODUCT.md in one shot |
| `gates` | Run all 23 hard-blocking gates `[DESIGN.md] [PRODUCT.md] [src/]` |
| `validate` | Validate DESIGN.md six-section contract |
| `score` | Score DESIGN.md quality against the rubric |
| `scan` | Scan frontend source for AI slop and a11y issues `[src/]` |
| `scan:a11y` | Deep ARIA/landmark/semantics audit (WCAG 2.2 mapped) `[--strict]` |
| `scan:viewport` | Playwright-based viewport fit scan at 8 breakpoints |
| `amplify` | Repair an old or weak DESIGN.md into a gate-passing version |
| `intake` | Interactive intake session → `INTAKE.session.md` |
| `standards` | Generate 2026 standards search brief |

**Short alias:** `vdma` works everywhere `vibe-design-md-architect` does.

```bash
npx vdma preflight         # full autopilot run
npx vdma scan src/         # scan for slop
npx vdma gates             # run all 23 gates
npx vdma amplify           # repair your DESIGN.md
```

---

## 🛑 What it blocks

### Visual slop (before a line of CSS)

| Pattern | What the agent does without this skill |
|---------|---------------------------------------|
| Purple → blue gradient | Default gradient identity every AI picks |
| Gradient text headings | "AI-made" tell every developer sees |
| Generic glass cards | Decoration without hierarchy reason |
| Identical feature cards | Same radius, same spacing, no differentiation |
| Sparkle / magic wand icons | AI's default "smart feature" icon language |
| Emoji as UI icons | Nav, buttons, cards, pricing — all emoji |
| Generic dark cyber look | Every "SaaS" AI agent defaults to this |
| Default `Inter` font | Uncurated font choice with zero brand intent |
| Purple/indigo as brand | Default Tailwind accent shipped as identity |

### Structural failures (before implementation)

| Failure | Impact |
|---------|--------|
| Clickable `<div>` instead of `<button>` | Keyboard broken, screen readers silent |
| No focus ring | Keyboard users navigate blind |
| Missing landmarks (`main`, `nav`) | Screen reader structure destroyed |
| `alert()` / `confirm()` for product flows | Modal broken on mobile, no styling possible |
| Placeholder as the only field label | Label disappears when user types |
| `height: 100vh` on auth pages | Breaks on mobile keyboards, clips on small screens |
| `overflow: hidden` to fix scroll | Hides layout bug, breaks keyboard, locks zoom |
| Hardcoded hex colors | Token drift guaranteed after second iteration |
| Lorem ipsum shipped | Real users see fake data |

### Overlay / interaction failures

| Failure | Impact |
|---------|--------|
| Modal without focus trap | Tab escapes into background |
| Background scrolls behind modal | Disorienting on mobile |
| Toast built manually in page | Impossible to position centrally, z-index chaos |
| Dropdown clipped by `overflow: hidden` parent | User cannot see options |
| Popup hardcoded single direction | Clips viewport at page bottom |
| Magic z-index numbers | Overlaps break randomly |
| API key shown in full in table | Security UX failure |

---

## 🚦 23 Hard-Blocking Gates

Implementation is blocked until all gates pass.

| # | Gate | What it enforces |
|---|------|-----------------|
| 1 | Design System Baseline | Select Atlassian / Polaris / Material / HIG / Custom before any design work |
| 2 | Intake Session | Product context, user, job, localization, RTL/LTR, risk level |
| 3 | 2026 Standards Search | WCAG 2.2, MDN Baseline, web.dev, framework docs |
| 4 | Impeccable Install | `npx impeccable skills install` before UI |
| 5 | PRODUCT.md | Strategy artifact exists and passes contract |
| 6 | DESIGN.md Six-Section | Exactly: Overview, Colors, Typography, Elevation, Components, Do's and Don'ts |
| 7 | Rules Engine | All gate checks pass |
| 8 | Accessibility + Directionality | WCAG AA contrast, focus, ARIA, LTR by default, RTL when confirmed |
| 9 | UX-CRX Logic | Primary action, secondary, recovery, decision point per screen |
| 10 | Mobile + Responsive | Mobile designed, not stacked from desktop |
| 11 | Popup + Feedback System | In-app modal/toast/banner/inline; no `alert()` / `confirm()` |
| 12 | Implementation Scan | `scan-ui-implementation.mjs` blockers cleared |
| 13 | Amplify Preservation | (Amplify Mode) Strong decisions kept, generic patterns removed |
| 14 | Semantic HTML + Interaction | No clickable divs, keyboard ops, landmarks, labeled icons |
| 15 | Realistic Content | No lorem ipsum, John Doe, example.com, Item 1/2/3 |
| 16 | Design Tokens | No hardcoded hex, fixed padding, or magic numbers |
| 17 | Drift Control | Single source of truth, gates re-run per merge |
| 18 | Viewport Governance | Scroll ownership per route; `dvh` fallback; no `overflow:hidden` |
| 19 | Modal + Dialog | Focus trap, scroll lock, backdrop, viewport-safe sizing, inert background |
| 20 | Dashboard Shell | Declared grid, scroll ownership, auth hierarchy, form quality |
| 21 | Overlay Stack | Centralized overlay system, toast construction ban, collision handling |
| 22 | Sensitive Data Display | Tokens masked, secure creation via modal, destructive confirmation |
| 23 | Popup + Floating Positioning | Strategy A/B/C declared; flip/shift/size; portal mounting; z-index tokens |

---

## 🔧 Scanners

Three static and runtime scanners run automatically with `preflight`:

```bash
npx vdma scan src/              # AI slop + functional failures
npx vdma scan:a11y src/         # WCAG 2.2 ARIA/landmark audit
npx vdma scan:a11y src/ --strict   # fail on warnings too
npx vdma scan:viewport http://localhost:3000   # 8 viewport sizes (Playwright)
```

**`scan-ui-implementation.mjs`** — flags:
- 🔴 Blockers: clickable divs, native popups, lorem ipsum/fake data, blanket `overflow:hidden`, exposed API keys, manual toast in page components
- 🟡 Warnings: default Inter font, generic gradients, hardcoded hex, emoji icons, blind `h-screen`, fixed auth card widths

**`scan-accessibility.mjs`** — maps each finding to a WCAG 2.2 criterion:
- Multiple/missing `<main>`, heading order jumps, multiple `<h1>`
- `<img>` without `alt`, `aria-hidden` on interactive elements, positive tabindex
- Icon-only controls with no accessible name, missing `lang`/`dir` on `<html>`
- Clickable non-interactive elements, empty links or buttons

**`scan-viewport-fit.mjs`** (Playwright) — tests `single-screen-fit` routes at:
`320×568 → 360×640 → 390×844 → 414×896 → 768×720 → 1024×768 → 1280×720 → 1440×900`

---

## 📦 What you get

After running `preflight`, your project has:

```
INTAKE.session.md          ← product context, user, risks, localization
STANDARDS.search-notes.md  ← verified WCAG 2.2, MDN, web.dev, framework docs
PRODUCT.md                 ← product strategy, brand, accessibility needs
DESIGN.md                  ← full six-section design system (colors, type, components…)
```

Your Claude Code agent reads these files automatically and:
- ✅ Picks the right design system baseline
- ✅ Uses semantic tokens, not hardcoded values
- ✅ Respects keyboard navigation and ARIA
- ✅ Implements the right scroll governance per route
- ✅ Builds modals with focus trapping and scroll lock
- ✅ Uses the centralized overlay system
- ✅ Masks sensitive tokens by default
- ✅ Positions dropdowns with flip/shift/size

---

## 🔁 Amplify Mode

Have an old or weak `DESIGN.md`? Run Amplify Mode:

```bash
npx vdma amplify DESIGN.md PRODUCT.md
```

Amplify Mode:
1. Reads your old design file completely
2. Preserves product-specific decisions that are strong
3. Removes generic AI patterns, weak adjectives, vague color names
4. Converts colors to semantic tokens with hex values
5. Converts components to full implementation contracts
6. Adds missing contrast, RTL, responsive, modal, and overlay rules
7. Produces `DESIGN.amplification-report.md` + `DESIGN.amplified.md`
8. Scores the result. If below 90, revises before final output.

---

## 🔗 Companion tools

| Tool | Role | Install |
|------|------|---------|
| **Impeccable** *(mandatory)* | Frontend design intelligence, slop detection during build | `npx impeccable skills install` |
| **Vibe Driven Dev** *(recommended)* | Pre-execution layer: PRD, scope, stack decisions before design | `npx vibe-driven-dev install claude-code --project` |

Run them in this order: **VDD → this skill → Impeccable**.

---

## 📁 Repository structure

```
vibe-design-md-architect/
├── bin/
│   └── cli.mjs                          ← autopilot CLI (npx vdma)
├── scripts/
│   ├── run-gates.mjs                    ← all 23 gates runner
│   ├── scan-ui-implementation.mjs       ← AI slop + functional scanner
│   ├── scan-accessibility.mjs           ← WCAG 2.2 ARIA audit
│   ├── scan-viewport-fit.mjs            ← Playwright viewport scanner
│   ├── validate-design-md.mjs           ← six-section contract validator
│   ├── score-design-md.mjs              ← quality rubric scorer
│   ├── amplify-design-md.mjs            ← Amplify Mode engine
│   ├── intake-session.mjs               ← intake session generator
│   ├── standards-search-brief.mjs       ← 2026 standards brief
│   ├── bootstrap-design-artifacts.mjs   ← scaffold starter files
│   └── impeccable-preflight.sh          ← bash preflight
├── references/
│   ├── ai-failure-patterns.md           ← 24 evidence-based AI UI failures
│   ├── non-negotiable-ui-rules.md       ← hard UI rules
│   ├── overlay-system-rules.md          ← toast, modal, dropdown rules
│   ├── dashboard-shell-rules.md         ← dashboard layout governance
│   ├── sensitive-data-rules.md          ← token masking rules
│   ├── anti-ai-ui-slop.md               ← visual slop patterns
│   └── ...                             ← 12 more reference files
├── assets/
│   ├── DESIGN.template.md               ← full DESIGN.md template
│   ├── PRODUCT.template.md
│   ├── qa-checklist.md
│   ├── implementation-prompt.template.md
│   └── ...                             ← 6 more templates
├── evals/
│   └── eval-cases.json                  ← test prompts and rubric
├── SKILL.md                             ← Claude skill instruction file
├── CONTRIBUTING.md
├── CHANGELOG.md
└── package.json
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the gate addition workflow, template update guide, scanner rule guide, and PR checklist.

---

## 🔖 Versioning

See [CHANGELOG.md](./CHANGELOG.md) for the full history.

**Current: v1.7.0**
- Gate 23: Popup and Floating Element Positioning (Strategy A/B/C, portal mounting, z-index tokens)
- Directionality is now conditional: LTR default, RTL only when intake confirms RTL-primary language
- Modal centering hardened: `align-self: safe center` pattern, transform ban without height clamp

---

<div align="center">

**Made for AI-first development workflows.**

If this saved your project from shipping AI slop, consider starring ⭐ and sharing.

[GitHub](https://github.com/imMamdouhaboammar/vibe-design-md-architect) · [npm](https://www.npmjs.com/package/vibe-design-md-architect) · [skills.sh](https://skills.sh/imMamdouhaboammar/vibe-design-md-architect/vibe-design-md-architect) · [Issues](https://github.com/imMamdouhaboammar/vibe-design-md-architect/issues)

</div>
