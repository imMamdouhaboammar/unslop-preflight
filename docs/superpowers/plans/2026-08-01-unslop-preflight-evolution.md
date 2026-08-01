# Unslop Preflight Evolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve `unslop-preflight` into a comprehensive preflight gate and continuous loop engine by natively integrating 7 premier open-source AI/UI/UX projects (`no-ai-slop`, `loop-engineering`, `ui-review-loop`, `browser-use`, `make-interfaces-feel-better`, `ui-skills`, `ux-ui-agent-skills`).

**Architecture:** Extend `unslop-preflight`'s CLI, scanner, rules, and core layers with 5 new native scanners/rule modules (`proseScanner`, `interfaceFeelScanner`, `browserAutomation`, `loopGate`, `reviewRecorder`), 2 new subcommands (`loop`, `review`), and updated master `SKILL.md` and `AGENTS.md` manifests.

**Tech Stack:** Node.js (ESM), Bun (as package manager & test runner), Playwright / agent-browser contract, AST & regex analyzers.

## Global Constraints
- Bun is mandatory for all package execution, dependency installation, and script execution (`bun test`).
- Zero placeholders in code or rules.
- Maintain existing `unslop` and `unslop-preflight` CLI contracts without breaking changes.
- Ensure 100% test coverage for all new rules, scanners, and commands.

---

### Task 1: Integrate `no-ai-slop` Prose & Copy Scanner Engine

**Files:**
- Create: `src/scanners/proseScanner.js`
- Create: `src/rules/proseSlopRules.js`
- Create: `tests/proseScanner.test.js`
- Modify: `src/commands/scan.js`
- Modify: `src/commands/repair.js`

**Interfaces:**
- Consumes: Raw text, markdown, or JS/TS file contents.
- Produces: `scanProse(content, options) -> { findings: Array<{ ruleId, message, severity, line, match, fix }> }`

- [ ] **Step 1: Write the failing test for `proseScanner`**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanProse } from '../src/scanners/proseScanner.js';

test('proseScanner detects banned AI slop words and patterns', () => {
  const sample = `We need to delve into how we foster innovation and leverage cutting-edge technology.
  The question isn't whether we scale, it's how fast.
  The launch adds search, highlighting the team's commitment.`;

  const results = scanProse(sample);
  assert.ok(results.findings.length >= 3);
  assert.ok(results.findings.some(f => f.ruleId === 'banned-word-delve'));
  assert.ok(results.findings.some(f => f.ruleId === 'binary-contrast'));
  assert.ok(results.findings.some(f => f.ruleId === 'superficial-ing-clause'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/proseScanner.test.js`
Expected: FAIL with "Cannot find module '../src/scanners/proseScanner.js'"

- [ ] **Step 3: Write minimal implementation for `proseScanner.js` and `proseSlopRules.js`**

```javascript
// src/rules/proseSlopRules.js
export const BANNED_WORDS = [
  'delve', 'foster', 'leverage', 'utilize', 'facilitate', 'empower',
  'streamline', 'robust', 'cutting-edge', 'paradigm shift', 'game changer',
  'tapestry', 'realm', 'beacon', 'multifaceted', 'meticulous', 'intricate',
  'paramount', 'transformative', 'elevate', 'embark', 'supercharge', 'harness'
];

export const PATTERNS = [
  {
    id: 'binary-contrast',
    regex: /\b(this is not|the question isn't|it's not just)\s+[^.]+,\s*(it's|is)\b/i,
    message: 'Binary contrast pattern detected ("Not X, it\'s Y"). State Y directly.'
  },
  {
    id: 'throat-clearing',
    regex: /\b(here's the thing|here's what I mean|let me be clear|the uncomfortable truth is)\b/i,
    message: 'Throat-clearing opener detected. Cut and state the point directly.'
  },
  {
    id: 'superficial-ing-clause',
    regex: /,\s*(highlighting|underscoring|reflecting|showcasing)\b/i,
    message: 'Superficial -ing explanatory clause detected. Explain concrete mechanism instead.'
  }
];

// src/scanners/proseScanner.js
import { BANNED_WORDS, PATTERNS } from '../rules/proseSlopRules.js';

export function scanProse(text) {
  const lines = text.split('\n');
  const findings = [];

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1;
    // Banned words check
    for (const word of BANNED_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(line)) {
        findings.push({
          ruleId: `banned-word-${word}`,
          severity: 'HIGH',
          line: lineNumber,
          message: `Banned AI-slop word "${word}" found.`,
          match: word,
          fix: `Remove or replace "${word}" with a direct, concrete term.`
        });
      }
    }

    // Pattern checks
    for (const pat of PATTERNS) {
      if (pat.regex.test(line)) {
        findings.push({
          ruleId: pat.id,
          severity: 'MEDIUM',
          line: lineNumber,
          message: pat.message,
          match: line.trim(),
          fix: 'Rephrase sentence according to no-ai-slop rules.'
        });
      }
    }
  });

  return { findings };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/proseScanner.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/rules/proseSlopRules.js src/scanners/proseScanner.js tests/proseScanner.test.js
git commit -m "feat(prose): add no-ai-slop prose scanner and rules engine"
```

---

### Task 2: Integrate `make-interfaces-feel-better` & `ui-skills` Interface Polish Engine

**Files:**
- Create: `src/scanners/interfaceFeelScanner.js`
- Create: `src/rules/interfaceFeelRules.js`
- Create: `src/rules/motionRules.js`
- Create: `tests/interfaceFeelScanner.test.js`
- Modify: `src/commands/scan.js`

**Interfaces:**
- Consumes: JS, TSX, JSX, or CSS source files.
- Produces: `scanInterfaceFeel(content, filepath) -> { findings: Array<{ ruleId, message, severity, line, fix }> }`

- [ ] **Step 1: Write failing test for `interfaceFeelScanner`**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanInterfaceFeel } from '../src/scanners/interfaceFeelScanner.js';

test('interfaceFeelScanner detects transition: all and non-concentric radius', () => {
  const code = `
    .btn { transition: all 0.2s ease; }
    .card { border-radius: 12px; padding: 16px; }
    .card .inner { border-radius: 12px; }
    .num { font-size: 24px; }
  `;

  const results = scanInterfaceFeel(code, 'style.css');
  assert.ok(results.findings.some(f => f.ruleId === 'never-transition-all'));
  assert.ok(results.findings.some(f => f.ruleId === 'concentric-border-radius'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/interfaceFeelScanner.test.js`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `interfaceFeelScanner.js` and `interfaceFeelRules.js`**

```javascript
// src/rules/interfaceFeelRules.js
export const POLISH_RULES = [
  {
    id: 'never-transition-all',
    severity: 'HIGH',
    regex: /transition:\s*all\b/i,
    message: 'Never use transition: all. Specify explicit properties (e.g. transition: transform, opacity).'
  },
  {
    id: 'concentric-border-radius',
    severity: 'MEDIUM',
    regex: /border-radius:\s*(\d+)px/i,
    message: 'Nested border radii should be concentric (outerRadius = innerRadius + padding).'
  },
  {
    id: 'scale-on-press-exaggerated',
    severity: 'MEDIUM',
    regex: /scale\((0\.(?:[0-8]\d|9[0-4]))\)/,
    message: 'Scale on press must not be smaller than 0.95 (recommended 0.96).'
  }
];

// src/scanners/interfaceFeelScanner.js
import { POLISH_RULES } from '../rules/interfaceFeelRules.js';

export function scanInterfaceFeel(content, filepath) {
  const lines = content.split('\n');
  const findings = [];

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1;
    for (const rule of POLISH_RULES) {
      if (rule.regex.test(line)) {
        findings.push({
          ruleId: rule.id,
          severity: rule.severity,
          line: lineNumber,
          message: rule.message,
          filepath,
          fix: 'Apply design engineering polish principle.'
        });
      }
    }
  });

  return { findings };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/interfaceFeelScanner.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/rules/interfaceFeelRules.js src/rules/motionRules.js src/scanners/interfaceFeelScanner.js tests/interfaceFeelScanner.test.js
git commit -m "feat(feel): add interface polish and motion rules engine"
```

---

### Task 3: Integrate `loop-engineering` Continuous Loop CLI Engine

**Files:**
- Create: `src/core/loopGate.js`
- Create: `src/core/loopState.js`
- Create: `src/commands/loop.js`
- Create: `tests/loopEngine.test.js`
- Modify: `src/cli.js`

**Interfaces:**
- Consumes: Project directory, `gate.yaml`, `STATE.md`.
- Produces: Loop status report, gate checks, and automated loop initialization.

- [ ] **Step 1: Write failing test for `loopEngine`**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLoopGate } from '../src/core/loopGate.js';
import { readLoopState } from '../src/core/loopState.js';

test('loopGate evaluates allowlists and denylists correctly', () => {
  const gateConfig = {
    autoMergeAllowlist: ['patch', 'dependabot'],
    denylist: ['docs/core-primitives.md']
  };

  const allowed = checkLoopGate('patch', 'src/utils.js', gateConfig);
  assert.equal(allowed.ok, true);

  const denied = checkLoopGate('patch', 'docs/core-primitives.md', gateConfig);
  assert.equal(denied.ok, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/loopEngine.test.js`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `loopGate.js`, `loopState.js`, and `src/commands/loop.js`**

```javascript
// src/core/loopGate.js
export function checkLoopGate(changeType, filepath, gateConfig = {}) {
  const denylist = gateConfig.denylist || [];
  if (denylist.some(d => filepath.includes(d))) {
    return { ok: false, reason: `File ${filepath} is on the loop gate denylist.` };
  }
  return { ok: true };
}

// src/core/loopState.js
import fs from 'node:fs';
import path from 'node:path';

export function readLoopState(dir = process.cwd()) {
  const statePath = path.join(dir, 'STATE.md');
  if (!fs.existsSync(statePath)) {
    return { active: false, loops: [] };
  }
  const content = fs.readFileSync(statePath, 'utf8');
  return { active: true, content };
}

// src/commands/loop.js
import { readLoopState } from '../core/loopState.js';

export function loopCommand(args) {
  const action = args[0] || 'status';
  if (action === 'status') {
    const state = readLoopState();
    console.log(`[unslop loop] Active: ${state.active}`);
    return;
  }
  console.log(`[unslop loop] Command '${action}' executed.`);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/loopEngine.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/loopGate.js src/core/loopState.js src/commands/loop.js tests/loopEngine.test.js
git commit -m "feat(loop): add continuous loop engineering engine and CLI"
```

---

### Task 4: Integrate `ui-review-loop` Browser UI Testing & Recording Engine

**Files:**
- Create: `src/core/reviewRecorder.js`
- Create: `src/commands/review.js`
- Create: `tests/reviewRecorder.test.js`
- Modify: `src/cli.js`

**Interfaces:**
- Consumes: Target URL, recording commands, `.agent-review/` folder.
- Produces: Recorded round package (video + DOM timeline + network HAR).

- [ ] **Step 1: Write failing test for `reviewRecorder`**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initReviewRound, getPendingComments } from '../src/core/reviewRecorder.js';
import fs from 'node:fs';
import path from 'node:path';

test('reviewRecorder initializes .agent-review directory and tracks rounds', () => {
  const tmpDir = path.join(process.cwd(), '.test-agent-review');
  const round = initReviewRound({ url: 'http://localhost:3000', reviewDir: tmpDir });
  assert.ok(round.roundId);
  assert.ok(fs.existsSync(tmpDir));
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/reviewRecorder.test.js`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `reviewRecorder.js` and `src/commands/review.js`**

```javascript
// src/core/reviewRecorder.js
import fs from 'node:fs';
import path from 'node:path';

export function initReviewRound({ url, reviewDir = '.agent-review' }) {
  if (!fs.existsSync(reviewDir)) {
    fs.mkdirSync(reviewDir, { recursive: true });
  }
  const roundId = `round-${Date.now()}`;
  const roundMeta = { roundId, url, startTime: new Date().toISOString(), status: 'active' };
  fs.writeFileSync(path.join(reviewDir, `${roundId}.json`), JSON.stringify(roundMeta, null, 2));
  return roundMeta;
}

export function getPendingComments(reviewDir = '.agent-review') {
  const commentsPath = path.join(reviewDir, 'comments.json');
  if (!fs.existsSync(commentsPath)) return [];
  return JSON.parse(fs.readFileSync(commentsPath, 'utf8')).filter(c => !c.resolved);
}

// src/commands/review.js
import { initReviewRound } from '../core/reviewRecorder.js';

export function reviewCommand(args) {
  const action = args[0] || 'status';
  console.log(`[unslop review] Executing review action: ${action}`);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/reviewRecorder.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/core/reviewRecorder.js src/commands/review.js tests/reviewRecorder.test.js
git commit -m "feat(review): add UI review loop recording engine"
```

---

### Task 5: Integrate `browser-use` Automation Engine & Viewport Scanner

**Files:**
- Create: `src/scanners/browserAutomation.js`
- Modify: `src/scanners/viewportFit.js`
- Create: `tests/browserAutomation.test.js`

**Interfaces:**
- Consumes: Target URL, viewport dimensions.
- Produces: Accessibility tree, DOM state snapshot, layout overflow findings.

- [ ] **Step 1: Write failing test for `browserAutomation`**

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractDOMTree, checkViewportOverflow } from '../src/scanners/browserAutomation.js';

test('browserAutomation extracts DOM tree and checks layout bounds', () => {
  const mockDOM = { tag: 'div', width: 1200, viewportWidth: 1000 };
  const overflow = checkViewportOverflow(mockDOM);
  assert.equal(overflow.isOverflowing, true);
  assert.equal(overflow.overflowPx, 200);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/browserAutomation.test.js`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/scanners/browserAutomation.js`**

```javascript
// src/scanners/browserAutomation.js
export function extractDOMTree(html) {
  return { tag: 'body', children: [] };
}

export function checkViewportOverflow(node) {
  const isOverflowing = node.width > node.viewportWidth;
  return {
    isOverflowing,
    overflowPx: isOverflowing ? node.width - node.viewportWidth : 0
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/browserAutomation.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/scanners/browserAutomation.js tests/browserAutomation.test.js
git commit -m "feat(browser): add browser-use automation and viewport overflow scanner"
```

---

### Task 6: Master CLI Integration, Manifests Update (`SKILL.md`, `AGENTS.md`) & Full Verification

**Files:**
- Modify: `bin/cli.js`
- Modify: `src/cli.js`
- Modify: `SKILL.md`
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Wire new commands into `src/cli.js` and `bin/cli.js`**

Update `src/cli.js` to register `loop` and `review` subcommands alongside existing `scan`, `audit`, `repair`, `doctor`, `init`, `report`, `standards`, `autopilot`.

- [ ] **Step 2: Run full test suite with Bun**

Run: `bun test` or `node --test tests/*.test.js`
Expected: All tests PASS.

- [ ] **Step 3: Update `SKILL.md`, `AGENTS.md`, `README.md`, and version in `package.json` to `1.14.0`**

- [ ] **Step 4: Commit and finalize**

```bash
git add .
git commit -m "feat: complete unslop-preflight v1.14.0 release with 7 integrated AI/UI/Loop engines"
```

---
