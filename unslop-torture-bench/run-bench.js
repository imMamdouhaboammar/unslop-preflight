#!/usr/bin/env node
/**
 * Unslop Torture Bench Runner
 * Runs each case through audit + autopilot and produces a scored benchmark report.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
// bench lives at unslop-torture-bench/ — unslop root is one level up
const ROOT = resolve(__dirname, '..');

const { runAutopilotPipeline } = await import(join(ROOT, 'src/core/autopilotPlan.js'));

const CASES_DIR = resolve(process.argv[2] || 'cases');
const REPORT_PATH = resolve('benchmark-report.md');

const cases = [
  { id: '02-modal-scrollbar-slop', priority: 1, expectedFail: true },
  { id: '03-random-typography',    priority: 2, expectedFail: true },
  { id: '04-z-index-panic',        priority: 3, expectedFail: true },
  { id: '05-fake-root-cause',      priority: 4, expectedFail: true },
  { id: '09-code-only-failures',   priority: 5, expectedFail: true },
  { id: '12-repair-regression',    priority: 6, expectedFail: true, repairTest: true },
];

function scorePipeline(result, expectedFail, id) {
  const issues = result.issues || [];
  const evidences = result.evidences || issues; // fallback
  const errorCount = issues.filter(i => i.severity === 'error' || i.level === 'blocker').length;
  const warnCount  = issues.filter(i => i.severity === 'warning').length;
  const totalIssues = errorCount + warnCount;

  // Load EXPECTED.md
  const expectedPath = join(CASES_DIR, id, 'EXPECTED.md');
  const expected = existsSync(expectedPath) ? readFileSync(expectedPath, 'utf8') : '';
  const expectedIds = (expected.match(/^\s{2,4}-\s+(.+)/gm) || []).map(l => l.replace(/^\s+-\s+/, '').split(' ')[0].trim());

  // Detect which expected ids were caught
  const allRuleNames = [
    ...issues.map(i => i.id || i.rule || i.ruleName || ''),
    ...(evidences.map ? evidences.map(e => e.ruleName || '') : [])
  ].filter(Boolean);

  const caught = expectedIds.filter(eid =>
    allRuleNames.some(r => r === eid || r.includes(eid) || eid.includes(r))
  );
  const missed = expectedIds.filter(eid =>
    !allRuleNames.some(r => r === eid || r.includes(eid) || eid.includes(r))
  );

  // Scoring logic
  let score = 0;
  const isCorrectStatus = (expectedFail && totalIssues > 0) || (!expectedFail && totalIssues === 0);

  if (isCorrectStatus) score += 2;
  if (expectedIds.length > 0) {
    const catchRate = caught.length / expectedIds.length;
    if (catchRate >= 0.8) score += 2;
    else if (catchRate >= 0.5) score += 1;
  } else {
    score += 2; // No specific IDs required
  }
  // Bonus for each issue having evidence
  const withDiagnosis = issues.filter(i => i.rootCause || i.likelyRootCause || i.description);
  if (withDiagnosis.length === issues.length && issues.length > 0) score += 1;

  return {
    score: Math.min(score, 5),
    isCorrectStatus,
    errorCount,
    warnCount,
    caught,
    missed,
    allRuleNames,
    exitCode: result.exitCode,
    readiness: result.summary?.readiness || 'unknown',
  };
}

async function runBench() {
  const rows = [];
  let totalScore = 0;

  for (const c of cases) {
    const cwd = join(CASES_DIR, c.id);
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`▶ Case: ${c.id}`);

    let result;
    let repairResult = null;
    let idempotent = null;

    try {
      // Run autopilot (dry-run for non-repair cases, full for repair)
      if (c.repairTest) {
        // First run
        result = runAutopilotPipeline(cwd, {});
        const design1 = existsSync(join(cwd, 'DESIGN.md')) ? readFileSync(join(cwd, 'DESIGN.md'), 'utf8') : '';
        // Second run (idempotency)
        repairResult = runAutopilotPipeline(cwd, {});
        const design2 = existsSync(join(cwd, 'DESIGN.md')) ? readFileSync(join(cwd, 'DESIGN.md'), 'utf8') : '';
        idempotent = design1 === design2;
      } else {
        result = runAutopilotPipeline(cwd, { 'dry-run': true });
      }
    } catch (err) {
      console.error(`  ✖ ERROR: ${err.message}`);
      rows.push({
        id: c.id,
        score: 0,
        error: err.message,
      });
      continue;
    }

    const metrics = scorePipeline(result, c.expectedFail, c.id);
    totalScore += metrics.score;

    const icon = metrics.score >= 4 ? '✅' : metrics.score >= 3 ? '⚠️' : '❌';
    console.log(`  ${icon} Score: ${metrics.score}/5 | Status: ${metrics.isCorrectStatus ? 'CORRECT' : 'WRONG'} | Readiness: ${metrics.readiness}`);
    console.log(`  Issues: ${metrics.errorCount} errors, ${metrics.warnCount} warnings`);
    console.log(`  Caught expected IDs: ${metrics.caught.length} / ${metrics.caught.length + metrics.missed.length}`);
    if (metrics.missed.length) console.log(`  Missed: ${metrics.missed.join(', ')}`);
    if (c.repairTest && idempotent !== null) {
      console.log(`  Idempotent (run-twice same result): ${idempotent ? '✅ YES' : '❌ NO'}`);
    }

    rows.push({
      id: c.id,
      score: metrics.score,
      isCorrectStatus: metrics.isCorrectStatus,
      errorCount: metrics.errorCount,
      warnCount: metrics.warnCount,
      caught: metrics.caught,
      missed: metrics.missed,
      exitCode: metrics.exitCode,
      readiness: metrics.readiness,
      idempotent,
    });
  }

  const avg = totalScore / cases.length;
  const criticalMisses = rows.flatMap(r => r.missed || []).filter(id =>
    ['root-cause-mode-missing', 'blind-z-index-escalation', 'arbitrary-z-index-slop', 'symptom-patch-language'].includes(id)
  ).length;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`BENCHMARK COMPLETE`);
  console.log(`Average Score: ${avg.toFixed(2)} / 5.0`);
  console.log(`Critical Misses: ${criticalMisses}`);
  console.log(`Pass Threshold (>= 4.0 avg): ${avg >= 4.0 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`${'═'.repeat(60)}\n`);

  // Write markdown report
  let md = `# Unslop Torture Bench Report\n\n`;
  md += `**Average Score:** ${avg.toFixed(2)} / 5.0  \n`;
  md += `**Critical Misses:** ${criticalMisses}  \n`;
  md += `**Threshold:** ${avg >= 4.0 ? '✅ PASS' : '❌ FAIL (< 4.0)'}\n\n`;
  md += `---\n\n`;

  for (const r of rows) {
    if (r.error) {
      md += `## ❌ ${r.id}\n\n**ERROR:** \`${r.error}\`\n\n`;
      continue;
    }
    const icon = r.score >= 4 ? '✅' : r.score >= 3 ? '⚠️' : '❌';
    md += `## ${icon} ${r.id} — Score: ${r.score}/5\n\n`;
    md += `| Field | Value |\n|---|---|\n`;
    md += `| Status correct | ${r.isCorrectStatus ? 'YES' : 'NO'} |\n`;
    md += `| Readiness | \`${r.readiness}\` |\n`;
    md += `| Errors found | ${r.errorCount} |\n`;
    md += `| Warnings found | ${r.warnCount} |\n`;
    md += `| Expected IDs caught | ${r.caught?.length ?? 0} / ${(r.caught?.length ?? 0) + (r.missed?.length ?? 0)} |\n`;
    if (r.missed?.length) md += `| Missed IDs | ${r.missed.join(', ')} |\n`;
    if (r.idempotent !== null) md += `| Repair idempotent | ${r.idempotent ? 'YES' : 'NO'} |\n`;
    md += `\n`;

    // Decision
    if (r.score >= 4) md += `> **Decision:** pass\n\n`;
    else if (r.missed?.some(id => id.includes('code') || id.includes('z-index') || id.includes('modal'))) {
      md += `> **Decision:** needs source scanner improvement\n\n`;
    } else if (r.errorCount === 0 && r.warnCount === 0) {
      md += `> **Decision:** needs rule tuning (no issues found in failing case)\n\n`;
    } else {
      md += `> **Decision:** needs better report / rule tuning\n\n`;
    }
    md += `---\n\n`;
  }

  md += `## Gaps Identified\n\n`;
  const allMissed = [...new Set(rows.flatMap(r => r.missed || []))];
  if (allMissed.length > 0) {
    md += `These expected issue IDs were NOT detected across all cases:\n\n`;
    allMissed.forEach(id => md += `- \`${id}\`\n`);
  } else {
    md += `No systematic gaps detected.\n`;
  }

  md += `\n## Rule Coverage Roadmap\n\n`;
  md += `Rules that exist as expected IDs but lack implementation should be added to the roadmap:\n\n`;
  const missingRules = allMissed.filter(id => !['missing-skill', 'harness'].some(k => id.includes(k)));
  missingRules.forEach(id => md += `- [ ] \`${id}\`\n`);

  writeFileSync(REPORT_PATH, md);
  console.log(`Report written to: ${REPORT_PATH}`);
}

runBench().catch(err => {
  console.error('Bench crashed:', err);
  process.exit(1);
});
