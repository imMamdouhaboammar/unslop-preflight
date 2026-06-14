#!/usr/bin/env node
/**
 * Unslop Torture Bench Runner
 * ─────────────────────────────
 * Usage:
 *   node benchmarks/torture-bench/run-bench.js [cases-dir]
 *
 * Scoring:
 *   5 = Caught all expected IDs, correct status, issues have diagnosis
 *   4 = Caught >80% expected IDs, correct status
 *   3 = Caught ~50% expected IDs, correct status
 *   2 = Correct status, but generic warnings without specific IDs
 *   1 = Only caught 1 expected issue
 *   0 = Missed everything or wrong status
 *
 * ID resolution:
 *   Primary source: issue.id (spec rules)
 *   Secondary source: e.ruleName (Evidence/scanner objects)
 *   Alias map: maps legacy/scanner names → canonical spec ID for scoring only
 */

import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = resolve(__dirname, '../..');

const { runAutopilotPipeline } = await import(join(ROOT, 'src/core/autopilotPlan.js'));

// ──────────────────────────────────────────────────────────────────────────────
// Canonical ID Alias Map
// Maps scanner rule names or old expected IDs → canonical spec rule ID.
// Used for scoring ONLY — does not rename rules in the engine.
// ──────────────────────────────────────────────────────────────────────────────
const ALIAS_MAP = {
  // Scanner → Spec canonical
  'arbitrary-z-index-slop':            'arbitrary-z-index-slop',       // scanner, no spec alias
  'modal-internal-scroll-risk':        'modal-internal-scroll-missing', // scanner → spec
  'oversized-typography-mobile-risk':  'oversized-type-without-responsive-guard', // scanner → spec
  'fixed-inside-transform-bug':        'stacking-context-audit-missing',
  // Old expected names → canonical
  'random-type-sizing-language':       'random-type-sizing-language',   // same
  'blind-z-index-escalation':          'blind-z-index-escalation',      // same
};

function canonicalize(id) {
  return ALIAS_MAP[id] ?? id;
}

// ──────────────────────────────────────────────────────────────────────────────
const CASES_DIR  = resolve(process.argv[2] ?? join(__dirname, 'cases'));
const REPORT_OUT = resolve(ROOT, 'benchmarks/torture-bench/benchmark-report.md');

const CASES = [
  { id: '02-modal-scrollbar-slop', priority: 1, expectedFail: true },
  { id: '03-random-typography',    priority: 2, expectedFail: true },
  { id: '04-z-index-panic',        priority: 3, expectedFail: true },
  { id: '05-fake-root-cause',      priority: 4, expectedFail: true },
  { id: '09-code-only-failures',   priority: 5, expectedFail: true },
  { id: '12-repair-regression',    priority: 6, expectedFail: true, repairTest: true },
];

// ──────────────────────────────────────────────────────────────────────────────
function parseExpectedIds(expectedPath) {
  if (!existsSync(expectedPath)) return [];
  const text  = readFileSync(expectedPath, 'utf8');
  const lines = text.split('\n');
  const ids   = [];
  let inIds   = false;
  for (const line of lines) {
    if (/expected issue ids/i.test(line)) { inIds = true; continue; }
    if (inIds) {
      if (/^expected /i.test(line.trim()) && !/expected issue ids/i.test(line)) { inIds = false; continue; }
      const m = line.match(/^\s{2,}-\s+([a-z][a-z0-9-]+)/);
      if (m) ids.push(m[1].trim());
    }
  }
  return ids;
}

function collectAllIds(result) {
  const issues   = result.issues   ?? [];
  const evidences = result.evidences ?? issues;
  return [
    ...issues.map(i => i.id ?? i.rule ?? i.ruleName ?? ''),
    ...(Array.isArray(evidences) ? evidences.map(e => e.ruleName ?? e.id ?? '') : []),
  ].filter(Boolean).map(id => canonicalize(id));
}

function score(result, expectedFail, caseId) {
  const issues       = result.issues ?? [];
  const errorCount   = issues.filter(i => ['error','blocker'].includes(i.severity)).length;
  const warnCount    = issues.filter(i => i.severity === 'warning').length;
  const total        = errorCount + warnCount;
  const allIds       = collectAllIds(result);

  const expectedPath = join(CASES_DIR, caseId, 'EXPECTED.md');
  const expectedIds  = parseExpectedIds(expectedPath).map(canonicalize);

  const caught = expectedIds.filter(eid => allIds.some(r => r === eid || r.includes(eid) || eid.includes(r)));
  const missed = expectedIds.filter(eid => !allIds.some(r => r === eid || r.includes(eid) || eid.includes(r)));

  const correctStatus = expectedFail ? total > 0 : total === 0;

  let pts = 0;
  if (correctStatus)           pts += 2;
  if (expectedIds.length > 0) {
    const rate = caught.length / expectedIds.length;
    if (rate >= 0.8)           pts += 2;
    else if (rate >= 0.5)      pts += 1;
  } else {
    pts += 2; // no specific IDs required → full credit
  }
  // Bonus: issues have diagnosis text
  const withDiag = issues.filter(i => i.explanation || i.suggestedFix);
  if (issues.length > 0 && withDiag.length === issues.length) pts += 1;

  return {
    score: Math.min(pts, 5),
    correctStatus,
    errorCount,
    warnCount,
    caught,
    missed,
    expectedIds,
    allIds,
    exitCode:  result.exitCode,
    readiness: result.summary?.readiness ?? 'unknown',
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────────────
// Clean autopilot-injected blocks from fixture files before each bench run.
// This prevents bleed-over between runs and keeps benchmark fixtures pristine.
// ──────────────────────────────────────────────────────────────────────────────
import { writeFileSync as wfs, readdirSync, rmSync } from 'node:fs';

function stripUnslopBlocks(text) {
  return text.replace(/\n*<!-- unslop:start[\s\S]*?unslop:end.*?-->\n*/g, '').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function cleanFixture(cwd) {
  for (const f of ['PRODUCT.md', 'DESIGN.md', 'AGENTS.md']) {
    const p = join(cwd, f);
    if (existsSync(p)) {
      const original = readFileSync(p, 'utf8');
      const cleaned  = stripUnslopBlocks(original);
      if (cleaned !== original) wfs(p, cleaned);
    }
  }
  const unslopDir = join(cwd, '.unslop');
  if (existsSync(unslopDir)) {
    try { rmSync(unslopDir, { recursive: true, force: true }); } catch {}
  }
}

async function main() {
  const rows = [];
  let total  = 0;

  for (const c of CASES) {
    const cwd = join(CASES_DIR, c.id);
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`▶ Case: ${c.id}`);

    // Reset fixture to clean state before every run
    cleanFixture(cwd);

    let result, idempotent = null;

    try {
      if (c.repairTest) {
        result = runAutopilotPipeline(cwd, {});
        const d1 = existsSync(join(cwd, 'DESIGN.md')) ? readFileSync(join(cwd, 'DESIGN.md'), 'utf8') : '';
        runAutopilotPipeline(cwd, {});
        const d2 = existsSync(join(cwd, 'DESIGN.md')) ? readFileSync(join(cwd, 'DESIGN.md'), 'utf8') : '';
        idempotent = d1 === d2;
      } else {
        result = runAutopilotPipeline(cwd, { 'dry-run': true });
      }
    } catch (err) {
      console.error(`  ✖ ERROR: ${err.message}`);
      rows.push({ id: c.id, score: 0, error: err.message });
      continue;
    }

    const m   = score(result, c.expectedFail, c.id);
    total    += m.score;

    const icon = m.score >= 4 ? '✅' : m.score >= 3 ? '⚠️' : '❌';
    console.log(`  ${icon} Score: ${m.score}/5 | Status: ${m.correctStatus ? 'CORRECT' : 'WRONG'} | Readiness: ${m.readiness}`);
    console.log(`  Issues: ${m.errorCount} errors, ${m.warnCount} warnings`);
    if (m.expectedIds.length > 0) {
      console.log(`  Expected IDs caught: ${m.caught.length} / ${m.expectedIds.length}`);
    }
    if (m.missed.length) console.log(`  ❗ Missed: ${m.missed.join(', ')}`);
    if (idempotent !== null) console.log(`  Idempotent: ${idempotent ? '✅ YES' : '❌ NO'}`);

    rows.push({ id: c.id, ...m, idempotent });
  }

  const avg          = total / CASES.length;
  const criticalIds  = ['root-cause-mode-missing','agent-no-diagnosis-policy','blind-z-index-escalation','arbitrary-z-index-slop'];
  const critMisses   = rows.flatMap(r => r.missed ?? []).filter(id => criticalIds.includes(id)).length;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`BENCHMARK COMPLETE`);
  console.log(`Average Score:    ${avg.toFixed(2)} / 5.0`);
  console.log(`Critical Misses:  ${critMisses}`);
  console.log(`Pass (>= 4.0):    ${avg >= 4.0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`${'═'.repeat(60)}\n`);

  // ── Markdown report ────────────────────────────────────────────────────────
  let md = `# Unslop Torture Bench Report\n\n`;
  md += `**Average Score:** ${avg.toFixed(2)} / 5.0  \n`;
  md += `**Critical Misses:** ${critMisses}  \n`;
  md += `**Threshold:** ${avg >= 4.0 ? '✅ PASS' : '❌ FAIL (< 4.0)'}\n\n---\n\n`;

  for (const r of rows) {
    if (r.error) {
      md += `## ❌ ${r.id}\n\n**ERROR:** \`${r.error}\`\n\n---\n\n`;
      continue;
    }
    const icon = r.score >= 4 ? '✅' : r.score >= 3 ? '⚠️' : '❌';
    md += `## ${icon} ${r.id} — Score: ${r.score}/5\n\n`;
    md += `| Field | Value |\n|---|---|\n`;
    md += `| Status correct | ${r.correctStatus ? 'YES' : 'NO'} |\n`;
    md += `| Readiness | \`${r.readiness}\` |\n`;
    md += `| Errors found | ${r.errorCount} |\n`;
    md += `| Warnings found | ${r.warnCount} |\n`;
    md += `| Expected IDs caught | ${r.caught?.length ?? 0} / ${r.expectedIds?.length ?? 0} |\n`;
    if (r.missed?.length) md += `| Missed IDs | ${r.missed.join(', ')} |\n`;
    if (r.idempotent !== null) md += `| Repair idempotent | ${r.idempotent ? 'YES ✅' : 'NO ❌'} |\n`;
    md += `\n`;

    // Decision
    if (r.score >= 4) md += `> **Decision:** pass\n\n`;
    else if (r.missed?.some(id => criticalIds.includes(id))) md += `> **Decision:** needs rule tuning (critical miss)\n\n`;
    else if (!r.correctStatus) md += `> **Decision:** needs rule tuning (wrong status)\n\n`;
    else md += `> **Decision:** needs better ID coverage\n\n`;
    md += `---\n\n`;
  }

  // Gaps
  const allMissed = [...new Set(rows.flatMap(r => r.missed ?? []))];
  md += `## Gaps & Roadmap\n\n`;
  if (allMissed.length > 0) {
    md += `| Missed ID | Priority |\n|---|---|\n`;
    allMissed.forEach(id => {
      const crit = criticalIds.includes(id) ? '🔴 Critical' : '🟡 Normal';
      md += `| \`${id}\` | ${crit} |\n`;
    });
  } else {
    md += `No systematic gaps detected.\n`;
  }

  writeFileSync(REPORT_OUT, md);
  console.log(`Report written: ${REPORT_OUT}`);

  process.exit(avg >= 4.0 ? 0 : 1);
}

main().catch(err => { console.error('Bench crashed:', err); process.exit(1); });
