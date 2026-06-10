# Agent Workflow

When building products with AI coding agents (like Cursor, Claude Code, Windsurf, or Bolt), you need a strong system of constraints to prevent regression and hallucinated functionality.

## The Problem
Agents are incredibly fast but lack product context. If you simply say "build a dashboard," they might:
1. Ignore mobile layouts.
2. Forget loading/error states.
3. Overwrite your existing auth flow.
4. Render API keys in plaintext in the DOM.

## The Solution

By running \`vibe-design-md-architect autopilot\` before you begin coding, you establish a contract.

### 1. Initialize
Run \`npx vibe-design-md-architect autopilot\` in your project root.
This creates or validates \`PRODUCT.md\`, \`DESIGN.md\`, and \`AGENT.md\`.

### 2. Auto-Repair
The CLI will automatically inject missing safety checklists, accessibility rules, and security guidelines directly into your documentation.

### 3. Handoff to Agent
At the end of the run, the CLI will output a "Suggested Prompt for AI Coding Agent". 
Copy and paste this into your coding agent's chat interface.

**Example Prompt:**
> Inspect PRODUCT.md, DESIGN.md, and AGENT.md. Read \`.vibe-design/fix-list.md\` and resolve any listed issues. Implement the requested scope while preserving existing behavior. **MANDATORY**: Before you complete this task, you MUST run \`npx vibe-design-md-architect audit\` in the terminal, ensure there are 0 errors, and show me the final output score.

### 4. Review
Let the agent code. It will read the `.md` files and abide by the constraints you just established. Because of the strict instruction, it will run the audit and prove it has resolved all quality gates before stopping. Ensure the agent actually completes the Verification Checklist defined in `AGENT.md` before approving a PR or moving on.
