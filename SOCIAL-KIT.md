# Social Kit — Vibe Design MD Architect

Use these templates to share the tool on every platform. Copy, paste, adapt.

---

## 🐦 Twitter / X

### Thread (main launch — 7 tweets)

**Tweet 1 (hook)**
```
Your AI coding agent is about to generate UI slop.

Purple gradient. Default Inter. Identical rounded cards.
No RTL. No keyboard nav. No focus rings.

There's now a tool that blocks it before the first line of CSS.

🧵 Thread on Vibe Design MD Architect 👇
```

**Tweet 2 (problem)**
```
AI agents skip design every time.

They pick generic colors. They forget accessibility.
They ship alert(). They create 500px modals on 568px screens.
They use sparkle icons for "smart" features.

Then you spend hours "fixing" what looked fine in the screenshot.
```

**Tweet 3 (what it does)**
```
Vibe Design MD Architect is a Claude skill that runs before your agent touches frontend code.

It forces:
• Design System Baseline selection
• Product intake session
• WCAG 2.2 verification
• 23 hard-blocking quality gates

No DESIGN.md = no implementation.
```

**Tweet 4 (demo)**
```
One command. Full autopilot:

npx vibe-design-md-architect preflight

It runs:
✓ Intake session
✓ Standards search (WCAG 2.2, MDN, web.dev)
✓ Impeccable setup
✓ PRODUCT.md + DESIGN.md generation
✓ All 23 gates
✓ UI scanner (slop + a11y)
```

**Tweet 5 (what it blocks)**
```
It blocks:
🔴 Purple/blue gradient as brand identity
🔴 Clickable <div> instead of <button>
🔴 Native alert() for product flows
🔴 Dropdown that clips at viewport edge
🔴 Modal without focus trap
🔴 API key shown in full text
🔴 Lorem ipsum shipped to users
🔴 h-screen on mobile that breaks on keyboard open
```

**Tweet 6 (call to action)**
```
Install in 10 seconds:

npx skills add imMamdouhaboammar/vibe-design-md-architect

Or:

npx vibe-design-md-architect init

Works with Claude Code, Cursor, Windsurf — any AI coding agent that reads skill files.
```

**Tweet 7 (star CTA)**
```
If this saves your next project from shipping AI slop:

⭐ Star the repo
🔁 Retweet the thread
💬 Tell me what gate saved your project

→ github.com/imMamdouhaboammar/vibe-design-md-architect

#AIcoding #ClaudeCode #VibeCoding #WebDesign #UX
```

---

### Single-tweet options

**Option A — short hook:**
```
Your AI just picked purple gradient, default Inter, and identical rounded cards. Again.

npx vibe-design-md-architect preflight

23 gates. Runs before the first line of CSS.

github.com/imMamdouhaboammar/vibe-design-md-architect

#ClaudeCode #VibeCoding #AIcoding
```

**Option B — problem/solution:**
```
The problem with AI-generated UI:
• Generic colors
• No keyboard navigation  
• overflow:hidden on everything
• Modals with no focus trap

Vibe Design MD Architect: 23 hard-blocking gates that run before your agent touches frontend code.

npx vdma preflight

→ GitHub link in bio
```

**Option C — minimal:**
```
Stop your AI from shipping design slop.

npx vibe-design-md-architect init

23 gates. Auto-pilot. Works with Claude Code.

#WebDev #UX #AIcoding
```

---

## 💼 LinkedIn

**Post (professional angle):**

```
I've been watching AI coding agents make the same UI mistakes on repeat:

→ Purple-to-blue gradient as brand identity
→ No keyboard navigation
→ Modals that don't trap focus
→ API keys displayed in full text
→ Mobile that's just desktop stacked vertically

These aren't aesthetic preferences. They're accessibility failures, security UX failures, and interaction bugs that cost real hours to fix.

I built Vibe Design MD Architect to block all of this before a line of frontend code is written.

It's a Claude skill (works with Claude Code, Cursor, Windsurf) that runs 23 hard-blocking quality gates:

1. Forces design system baseline selection (Atlassian / Material / Polaris / HIG / Custom)
2. Runs an intake session — product context, user, localization, RTL/LTR requirement
3. Verifies current WCAG 2.2, MDN Baseline, and web.dev standards
4. Produces PRODUCT.md + DESIGN.md that the agent reads as design truth
5. Scans frontend source for slop, accessibility failures, and viewport bugs

One command:
npx vibe-design-md-architect preflight

It's open-source and free.

→ https://github.com/imMamdouhaboammar/vibe-design-md-architect

If you're building with AI agents and care about design quality, try it and let me know what you think.

#AI #WebDevelopment #UX #Accessibility #FrontendDevelopment #ClaudeAI #VibeCoding
```

---

## 🔴 Reddit

### r/ClaudeAI

**Title:**
```
I built a Claude skill that runs 23 quality gates before your agent touches frontend code — stops generic AI UI slop before it starts
```

**Post:**
```
I got tired of Claude generating:
- Purple gradient as brand identity
- Identical rounded feature cards
- Modals with no focus trap
- Native alert() for product flows
- height: 100vh that breaks on mobile keyboards
- API keys in full text inside tables

So I built Vibe Design MD Architect — a Claude skill that blocks all of this before implementation.

**How it works:**

The skill installs into `.claude/skills/` and runs before any frontend generation:

1. Asks for the design system baseline (Atlassian, Material, Polaris, HIG, or custom)
2. Runs a structured intake session — product, user, localization, RTL requirements
3. Verifies current WCAG 2.2 and MDN Baseline specs
4. Creates PRODUCT.md and DESIGN.md as source of truth
5. Runs 23 hard-blocking gates — if any fail, implementation is blocked
6. Scans frontend source for slop patterns and accessibility failures

**One command autopilot:**

```
npx vibe-design-md-architect preflight
```

Or install it as a skill:

```
npx skills add imMamdouhaboammar/vibe-design-md-architect
```

**What the 23 gates cover:**
- Contrast discipline (WCAG AA for every text/control/chart state)
- No clickable divs — only `<button>` and `<a>`
- No native popups — only in-app modal/toast/banner/inline
- Viewport governance — scroll ownership per route, no overflow:hidden hack
- Modal governance — focus trap, scroll lock, backdrop, viewport-safe sizing
- Overlay stack governance — centralized overlay system, no ad-hoc fixed toast
- Popup positioning — flip/shift/size middleware, portal mounting, z-index tokens
- Sensitive data display — tokens masked, secure creation via modal

It works with Claude Code, Cursor, and any AI agent that reads skill files.

GitHub: https://github.com/imMamdouhaboammar/vibe-design-md-architect

Happy to answer questions about how any specific gate works.
```

---

### r/webdev

**Title:**
```
Built an open-source tool that blocks AI agents from generating generic UI slop — 23 design gates, CLI autopilot, works with Claude Code
```

**Post:**
```
AI coding agents make the same frontend mistakes every time. I catalogued 24 of them with WCAG mappings and evidence from 2026 accessibility audits, then built gates that block them before implementation.

The tool is called Vibe Design MD Architect.

**What it blocks (before code):**

Structural failures:
- Clickable `<div>` instead of `<button>` (keyboard broken)
- `height: 100vh` on auth pages (clips on mobile keyboard)
- `overflow: hidden` to fix scroll (hides the bug, breaks zoom)
- Missing focus rings
- Native `alert()` / `confirm()` for product flows
- Hardcoded hex colors (token drift after second iteration)

Visual failures:
- Purple/blue gradient identity (every AI's default)
- Default Inter font with zero brand intent
- Identical rounded feature cards
- Sparkle/magic wand icons as "smart" UI language
- Emoji in navigation and buttons

Overlay/interaction failures:
- Modal without focus trap
- Background scrolls behind open modal
- Dropdown clipped by `overflow: hidden` parent
- Popup hardcoded single direction (clips at viewport bottom)
- Toast built manually with `position: fixed` in page component

**CLI:**
```
npx vibe-design-md-architect preflight    # full autopilot
npx vibe-design-md-architect scan src/   # scan for slop
npx vibe-design-md-architect gates       # run all 23 gates
```

Open source, MIT, no dependencies beyond Node.js.

https://github.com/imMamdouhaboammar/vibe-design-md-architect
```

---

### r/LocalLLaMA

**Title:**
```
Open-source tool: 23 design quality gates that run before AI agents write frontend code — blocks the generic slop patterns
```

---

## 🟠 Hacker News

**Title:**
```
Show HN: Vibe Design MD Architect – 23-gate design quality enforcer for AI coding agents
```

**Text:**
```
I built a tool called Vibe Design MD Architect that enforces design quality gates before AI agents write frontend code.

The problem it solves: AI coding agents (Claude Code, Cursor, Windsurf, etc.) consistently produce the same failure patterns:
- Purple gradient identity
- Modals without focus trapping
- `height: 100vh` that breaks on mobile keyboards
- `overflow: hidden` used to hide layout bugs
- Native `alert()` for product flows
- API keys displayed in full text in tables
- Hardcoded hex values that drift after iteration

These aren't aesthetic problems. Several are accessibility failures (WCAG 2.2 violations), some are security UX failures, and all of them require manual cleanup that erodes the productivity gains of AI coding.

The tool runs 23 hard-blocking "gates" before implementation is allowed. If any gate fails, the agent must repair the artifact before writing code.

Gates include:
- Design system baseline selection (first mandatory question)
- Structured intake session (product, user, localization, RTL/LTR requirement)
- 2026 standards verification (WCAG 2.2, MDN Baseline, web.dev, framework docs)
- Viewport governance (scroll ownership per route, dvh fallback, no overflow:hidden hack)
- Modal governance (focus trap, scroll lock, inert background, viewport-safe sizing)
- Popup positioning (must declare Strategy A/B/C: CSS Anchor, Floating UI, or CSS clamp)
- Overlay stack governance (centralized overlay system, toast construction ban)
- Sensitive data display (tokens masked by default, secure creation via modal)

The tool also includes three static/runtime scanners:
- `scan-ui-implementation.mjs`: flags slop patterns and accessibility failures with severity levels
- `scan-accessibility.mjs`: ARIA/landmark/semantics audit mapped to WCAG 2.2 criteria
- `scan-viewport-fit.mjs`: Playwright-based test at 8 viewport sizes

CLI autopilot (no install required):
`npx vibe-design-md-architect preflight`

It's a Claude skill that works with any AI coding agent reading skill files. MIT licensed.

https://github.com/imMamdouhaboammar/vibe-design-md-architect

I'm interested in feedback on the gate design, particularly Gates 21-23 (overlay stack, sensitive data, popup positioning) which are the newest additions.
```

---

## 💬 Discord (Claude / AI coding communities)

**Short drop (Claude Discord / Anthropic community):**
```
Built a Claude skill that blocks AI UI slop before it's generated.

23 hard-blocking design gates — intake session, WCAG 2.2 verification, modal/overlay governance, popup positioning.

npx vibe-design-md-architect init

→ github.com/imMamdouhaboammar/vibe-design-md-architect

Full autopilot with: npx vdma preflight
```

**Longer drop (web dev Discords):**
```
Anyone else exhausted by AI agents defaulting to purple gradient + identical rounded cards every time?

I catalogued 24 evidence-based AI UI failure patterns (with WCAG 2.2 mappings) and built a tool that gates on them before any CSS is written.

CLI autopilot:
`npx vibe-design-md-architect preflight`

It forces:
• Design system baseline selection upfront
• Structured intake (product, user, RTL, localization)
• WCAG 2.2 verification
• 23 hard-blocking quality gates
• UI scanner (slop + accessibility)

MIT, no runtime dependencies, works with Claude Code/Cursor/Windsurf.

→ https://github.com/imMamdouhaboammar/vibe-design-md-architect
```

---

## 📝 Dev.to / Hashnode Article Title Options

```
1. "How I stopped my AI agent from shipping generic UI: 23 design gates that block slop before implementation"

2. "The 24 most common AI frontend failures (and how to block all of them automatically)"

3. "Vibe Design MD Architect: a CLI tool that enforces design quality on AI-generated frontends"

4. "Stop your AI from generating purple gradients: building a design gate system for Claude Code"

5. "23 hard rules for AI-generated UI — and a CLI that enforces them automatically"
```

---

## 🏪 Product Hunt Launch

**Tagline:**
```
23-gate design quality enforcer for AI coding agents
```

**Description:**
```
Vibe Design MD Architect is a CLI tool and Claude skill that runs 23 hard-blocking design gates before your AI agent writes frontend code.

It blocks the patterns AI coding agents repeat on every project: purple gradients, missing focus rings, modals without focus trapping, dropdowns that clip at the viewport edge, and API keys in plain text.

The tool forces a structured design process — design system baseline selection, product intake session, WCAG 2.2 verification — and produces PRODUCT.md and DESIGN.md as authoritative design truth the agent reads.

One command: npx vibe-design-md-architect preflight
```

**Topics:** Developer Tools, Design, Productivity, Open Source, Artificial Intelligence

---

## 📦 npm Registry Description

Already set in `package.json`:
```
Autopilot design quality gates for AI-assisted UI — 23 hard-blocking gates that create, audit, and amplify PRODUCT.md and DESIGN.md before implementation. Stops generic AI-looking frontend before it starts.
```

---

## 🔖 GitHub Topics to Add

Go to: https://github.com/imMamdouhaboammar/vibe-design-md-architect → Settings → Topics

Add these topics (one by one):
```
claude
claude-code
ai-coding
vibe-coding
design-system
accessibility
wcag
ux-engineering
frontend-quality
anti-slop
impeccable
design-tokens
rtl
skill
skills-sh
```
