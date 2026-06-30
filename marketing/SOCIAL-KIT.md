# SOCIAL-KIT — Spread the Word

> [!NOTE]
> Draft marketing copy. These examples are not product guarantees or user testimonials.

---

## Why share this?

You used this tool. It made your project better.

There are thousands of developers right now dealing with the same thing — their AI agent just shipped purple gradient cards, forgot keyboard navigation, used `alert()` for a checkout flow, or created a 500px modal on a 568px screen.

You know how to fix that. One share might save someone a full day of cleanup.

**The reciprocity loop:**
1. You found this through someone else's share
2. You ran `npx unslop-preflight autopilot` and it caught something real
3. Now someone else needs to find it

---

## 🐦 Twitter / X

### Example: If autopilot caught a bug in your project

```
My AI just generated this modal:

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;  /* no max constraint */

On a 568px screen.

npx unslop-preflight autopilot caught it before I shipped it.

→ github.com/imMamdouhaboammar/unslop-preflight

#ClaudeCode #VibeCoding #WebDev
```

---

```
Ran this on my project before starting UI:

npx unslop-preflight autopilot

It created DESIGN.md, ran 23 gates, found 4 issues I would have shipped.

Worth the 2 minutes.

→ github.com/imMamdouhaboammar/unslop-preflight
```

---

```
Things my AI agent stopped doing after I installed this skill:

• Purple gradient as brand identity
• height: 100vh on mobile (breaks when keyboard opens)
• alert() for product confirmation flows
• Modals with no focus trap
• Hardcoded hex values instead of design tokens

One command:
npx unslop-preflight autopilot

#AIcoding #ClaudeCode #frontend
```

---

### Example: If the scan caught slop in existing code

```
Just scanned my existing frontend with:

npx unslop-preflight scan src/

Found 6 blockers I had no idea about:
• clickable <div> instead of <button> in 3 places
• overflow: hidden on body (hiding a layout bug)
• icon-only buttons with no accessible name

This is a free tool. No install needed.

→ github.com/imMamdouhaboammar/unslop-preflight
```

---

### Example: Minimal / casual

```
free tool that stops your AI from shipping ugly frontend

npx unslop-preflight autopilot

[no install, one command, works with Claude Code/Cursor/Windsurf]

#VibeCoding
```

---

```
accidentally discovered this scans for AI UI slop before you implement

npx unslop-preflight scan src/

flagged 4 things my AI put in that I would have shipped

→ github.com/imMamdouhaboammar/unslop-preflight
```

---

### Example: For developers who use Claude Code specifically

```
If you use Claude Code, this is worth knowing:

1. npx unslop-preflight init
2. npx unslop-preflight autopilot

It installs a skill that forces Claude to do proper design intake before UI.
23 gates. Auto-repairs failures. Writes VDMA-FIXES.md for the rest.

No more "generic AI look"
→ github.com/imMamdouhaboammar/unslop-preflight
```

---

## 💼 LinkedIn

### Example: After using it on a real project

```
I've been using an open-source tool called Unslop Preflight on my last two projects, and wanted to share it.

It runs before the AI touches any frontend code. One command:

npx unslop-preflight autopilot

In about 90 seconds it:
→ Creates PRODUCT.md and DESIGN.md if you don't have them
→ Runs 23 quality gates on your design artifacts  
→ Auto-repairs everything it can fix automatically
→ Writes a fix list for things that need a human or AI agent

What it caught on my last project:
• Modals without focus trapping (WCAG failure)
• API key field showing full token value in a table
• height: 100vh on mobile auth pages (breaks when keyboard opens)
• Overflow: hidden masking a layout bug

All of these would have shipped. None of them are things I would have noticed in a code review without prompting for them specifically.

It's MIT licensed, no dependencies beyond Node.js, works with Claude Code, Cursor, and Windsurf.

Worth trying on your current project.

→ https://github.com/imMamdouhaboammar/unslop-preflight

#AI #WebDevelopment #Accessibility #FrontendEngineering #ClaudeCode
```

---

### Example: Shorter / casual LinkedIn

```
Quick tip for anyone using AI coding agents:

Before your agent writes any frontend code, run:
npx unslop-preflight autopilot

It's a free CLI that creates your design system artifacts and blocks 23 common AI UI failures — including accessibility issues, overflow bugs, insecure data display, and broken mobile behavior.

Saved me from shipping at least 4 real problems last week.

Open source: github.com/imMamdouhaboammar/unslop-preflight

#AI #Frontend #UX
```

---

## 🔴 Reddit

### Example: r/ClaudeAI

**Title:**
```
This free CLI stopped my Claude agent from generating another generic dark SaaS with purple gradients and no keyboard nav
```

**Post:**
```
Been using Claude Code for about 3 months and kept running into the same problem — Claude picks the same visual defaults every time. Purple/indigo gradients, identical rounded cards, Inter font, no RTL, missing focus rings.

Found this tool last week: Unslop Preflight

One command before any UI work:

npx unslop-preflight autopilot

What it does:
1. Creates PRODUCT.md and DESIGN.md if you don't have them
2. Runs your design artifacts through 23 quality gates
3. Auto-patches anything it can fix directly (missing sections, design tokens, modal contract, z-index scale, viewport rules)
4. For source issues, writes VDMA-FIXES.md with exact fixes for Claude to apply

On my current project it caught:
- No focus trap in my modals
- height: 100vh on login page (clips on iOS keyboard)
- overflow: hidden on body (was hiding a layout bug I knew about but hadn't fixed)
- 3 clickable divs instead of buttons
- No accessible name on icon-only nav buttons

None of that would have failed CI. All of it would have shipped.

Free, MIT, works completely offline, no API calls.

→ https://github.com/imMamdouhaboammar/unslop-preflight
```

---

### Example: r/webdev

**Title:**
```
Free CLI that scans AI-generated frontend for the patterns everyone hates — clickable divs, overflow:hidden hacks, modal without focus trap, hardcoded colors
```

**Post:**
```
I know "here's a tool" posts can be annoying, but this one is legitimately useful and I want more people to know it exists.

It's called Unslop Preflight. It runs static analysis on your frontend code for patterns that AI coding agents keep introducing.

```
npx unslop-preflight scan src/
```

What it flags:

🔴 Blockers (gates hard-fail):
- Clickable `<div>` / `<span>` instead of `<button>`
- `alert()` / `confirm()` / `prompt()` for product flows
- `overflow: hidden` on `html`, `body`, or `#root`
- `height: 100vh` without `dvh` fallback
- Icon-only buttons with no accessible name
- API keys / tokens displayed in full text in tables

🟡 Warnings (flagged, not blocked):
- Default Inter font with no explicit brand choice
- Hardcoded hex values instead of design tokens
- Generic purple/indigo color as brand identity
- Gradient text headings
- Lorem ipsum in any file

It also has an "autopilot" mode that runs the full loop — creates design artifacts, gates, scans, auto-repairs what it can, writes a fix list for the rest:

```
npx unslop-preflight autopilot
```

MIT licensed. No install required. Works with Claude Code, Cursor, Windsurf.

→ https://github.com/imMamdouhaboammar/unslop-preflight
```

---

### Example: r/LocalLLaMA

**Title:**
```
Tool for stopping local LLM agents from generating generic AI-looking frontend — 23 gates, CLI autopilot, MIT
```

**Post:**
```
If you run local coding agents (Ollama, LM Studio, etc.) you've probably seen the same frontend outputs I have.

The models pick the same defaults: purple gradient hero, identical feature cards, Inter everywhere, no accessibility, overflow:hidden to fix whatever's broken.

This tool creates a design context file (DESIGN.md) that the agent reads before touching frontend code. The autopilot mode scaffolds it, validates it, and blocks implementation until 23 quality gates pass.

npx unslop-preflight autopilot

It works with any coding agent that reads skill files — Claude Code, but also any model you've set up with a skill/context folder.

Source: https://github.com/imMamdouhaboammar/unslop-preflight
```

---

## 🟠 Hacker News

**Title:**
```
Show HN: I used this tool to catch 6 accessibility failures in my AI-generated UI before shipping
```

### Example: Comment-style post (to put in the thread):

```
I've been running AI coding agents for my side project and wanted to share a tool I found that's been genuinely useful: Unslop Preflight.

It runs before any frontend code is written. One command:

  npx unslop-preflight autopilot

What actually happened when I ran it on my current project:

1. It created PRODUCT.md and DESIGN.md scaffolds (I had neither)
2. It ran 23 quality gates and failed 8 of them
3. It auto-patched 5 (missing sections in design artifacts, added viewport contract, modal contract, z-index token scale)
4. It wrote VDMA-FIXES.md with the remaining 3 source-level issues

The source issues it found: no focus trap in my modals (WCAG 2.4.3), icon buttons with no accessible name (WCAG 4.1.2), and height: 100vh on my login page (clips on iOS when keyboard opens).

These are exactly the things that pass code review and fail real users.

The tool is MIT, no dependencies beyond Node.js, works offline. Source at:
https://github.com/imMamdouhaboammar/unslop-preflight
```

---

## 💬 Discord (Claude / AI dev communities)

### Example: Short drop

```
if you use AI coding agents and haven't run this yet, worth doing:

npx unslop-preflight autopilot

caught 4 things in my project I was about to ship
works with Claude Code, Cursor, Windsurf — no install needed

→ github.com/imMamdouhaboammar/unslop-preflight
```

---

### Example: Longer explanation

```
hey, sharing this because it helped my project and I think others would find it useful

it's called Unslop Preflight — a CLI that runs before your AI writes any frontend

what it does:
• creates DESIGN.md + PRODUCT.md if you don't have them
• runs 23 quality gates (accessibility, viewport governance, modal contract, design tokens, anti-slop)
• auto-repairs everything it can fix in the design artifacts
• writes VDMA-FIXES.md for source issues that need the agent to fix

autopilot mode (full run):
npx unslop-preflight autopilot

specific scans:
npx unslop-preflight scan src/        # scan for slop and a11y issues
npx unslop-preflight repair           # auto-fix DESIGN.md
npx unslop-preflight gates            # run all 23 gates manually

MIT, works offline, no API keys

→ https://github.com/imMamdouhaboammar/unslop-preflight
```

---

## 📝 Dev.to / Hashnode — Example personal article titles

Write from your own experience using the tool:

```
1. "How I stopped my AI agent from shipping inaccessible frontend — the tool I use before every project"

2. "npx unslop-preflight autopilot: the one command I run before my AI writes any CSS"

3. "I scanned my AI-generated codebase and found 6 WCAG failures. Here's the tool I now use to prevent them"

4. "The 23 design checks I never remembered to do — now automated in one CLI command"

5. "Unslop Preflight caught 4 issues my code review didn't — here's what they were"
```

---

## 🌟 GitHub — Star and share

The simplest support:

1. **Star the repo:** https://github.com/imMamdouhaboammar/unslop-preflight
2. **Share the star** — when you star, it shows on your GitHub activity. Followers notice.
3. **Use it in your next project** — then share what it caught (even one real finding is a great post)

---

## ⭐ Why it matters

This tool catches:
- Accessibility failures that hurt real users
- Mobile bugs that affect the majority of your users
- Security UX failures that expose sensitive data
- Design drift that makes AI-built products look AI-built

Every share gets it in front of one more developer who's about to ship one of these.

**The loop:**
```
You found it → used it → it caught something → you shared it → someone else found it
```
