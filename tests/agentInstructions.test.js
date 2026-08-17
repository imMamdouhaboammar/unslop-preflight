import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadContext } from '../src/core/auditor.js';
import { applyRepairs } from '../src/core/repair.js';

const cli = fileURLToPath(new URL('../bin/cli.js', import.meta.url));

function temp() {
  return mkdtempSync(join(tmpdir(), 'unslop-agent-file-'));
}

function write(cwd, file, content = `# ${file}\n`) {
  writeFileSync(join(cwd, file), content, 'utf8');
}

function run(args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}

function doctorIssues(cwd) {
  const result = run(['doctor', '--json'], cwd);
  assert.equal(result.status, 0);
  return JSON.parse(result.stdout).issues;
}

test('doctor accepts canonical AGENTS.md without reporting agent instructions missing', () => {
  const cwd = temp();
  write(cwd, 'AGENTS.md');
  const issues = doctorIssues(cwd);
  assert.equal(issues.some((issue) => /agent.*missing/i.test(issue.id)), false);
});

test('doctor preserves legacy AGENT.md compatibility', () => {
  const cwd = temp();
  write(cwd, 'AGENT.md');
  const issues = doctorIssues(cwd);
  assert.equal(issues.some((issue) => /agent.*missing/i.test(issue.id)), false);
});

test('doctor prefers AGENTS.md when both files exist and reports AGENTS.md when neither exists', () => {
  const both = temp();
  write(both, 'AGENTS.md');
  write(both, 'AGENT.md');
  assert.equal(doctorIssues(both).some((issue) => /agent.*missing/i.test(issue.id)), false);

  const neither = temp();
  const missing = doctorIssues(neither).filter((issue) => /agent.*missing/i.test(issue.id));
  assert.equal(missing.length, 1);
  assert.match(missing[0].title, /AGENTS\.md/);
});

test('audit context loads only the canonical instruction file when both files exist', () => {
  const cwd = temp();
  write(cwd, 'PRODUCT.md', '# Product\n');
  write(cwd, 'DESIGN.md', '# Design\n');
  write(cwd, 'AGENTS.md', 'CANONICAL-INSTRUCTIONS\n');
  write(cwd, 'AGENT.md', 'LEGACY-SHOULD-BE-IGNORED\n');

  const context = loadContext(cwd);
  assert.equal(context.agentInstructionFile, 'AGENTS.md');
  assert.match(context.agentInstructions, /CANONICAL-INSTRUCTIONS/);
  assert.equal(context.files['AGENTS.md'], 'CANONICAL-INSTRUCTIONS\n');
  assert.equal(Object.hasOwn(context.files, 'AGENT.md'), false);
  assert.match(context.all, /CANONICAL-INSTRUCTIONS/);
  assert.doesNotMatch(context.all, /LEGACY-SHOULD-BE-IGNORED/);
});

test('audit preserves an existing empty canonical file instead of falling back to legacy content', () => {
  const cwd = temp();
  write(cwd, 'AGENTS.md', '');
  write(cwd, 'AGENT.md', 'LEGACY-SHOULD-BE-IGNORED\n');

  const context = loadContext(cwd);
  assert.equal(context.agentInstructionFile, 'AGENTS.md');
  assert.equal(context.agentInstructions, '');
  assert.equal(context.files['AGENTS.md'], '');
  assert.equal(Object.hasOwn(context.files, 'AGENT.md'), false);
  assert.doesNotMatch(context.all, /LEGACY-SHOULD-BE-IGNORED/);
});

test('repair writes agent sections only to the active canonical file when both exist', () => {
  const cwd = temp();
  write(cwd, 'PRODUCT.md', '# Product\n');
  write(cwd, 'DESIGN.md', '# Design\n');
  write(cwd, 'AGENTS.md', '# Canonical\n');
  write(cwd, 'AGENT.md', '# Legacy\n');

  applyRepairs(cwd, { safeDocs: [{ ruleName: 'missing-do-not-break' }], suggestedPatches: [] });

  const canonical = readFileSync(join(cwd, 'AGENTS.md'), 'utf8');
  const legacy = readFileSync(join(cwd, 'AGENT.md'), 'utf8');
  assert.match(canonical, /unslop:start missing-do-not-break/);
  assert.equal(legacy, '# Legacy\n');
});

test('report prompt references canonical AGENTS.md when present', () => {
  const cwd = temp();
  write(cwd, 'AGENTS.md');
  write(cwd, 'AGENT.md');
  const result = run(['report', '--json'], cwd);
  assert.equal(result.status, 0);
  const data = JSON.parse(result.stdout);
  assert.match(data.suggestedPrompt, /AGENTS\.md/);
  assert.doesNotMatch(data.suggestedPrompt, /\bAGENT\.md\b/);
});

test('report prompt references legacy AGENT.md only when it is the active file', () => {
  const cwd = temp();
  write(cwd, 'AGENT.md');
  const result = run(['report', '--json'], cwd);
  assert.equal(result.status, 0);
  const data = JSON.parse(result.stdout);
  assert.match(data.suggestedPrompt, /\bAGENT\.md\b/);
  assert.doesNotMatch(data.suggestedPrompt, /AGENTS\.md/);
});
