import { writeText } from './filesystem.js';

function escapeTableCell(value = '') {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function buildEvidenceTable(evidences) {
  if (!evidences || !evidences.length) return 'No issues found.';

  const headers = '| Severity | Type | Rule | Location | Symptom / Excerpt | Confidence |';
  const divider = '|----------|------|------|----------|-------------------|------------|';
  const rows = evidences.map((e) => {
    const loc = e.file ? `${e.file}${e.line ? `:${e.line}` : ''}` : 'N/A';
    return `| ${String(e.severity || 'info').toUpperCase()} | ${e.type || 'unknown'} | \`${e.ruleName}\` | \`${loc}\` | ${escapeTableCell(e.symptom || '')} | ${e.confidence || 'unknown'} |`;
  });

  return [headers, divider, ...rows].join('\n');
}

function buildScanStatsSection(scanStats = {}) {
  const stats = {
    filesScanned: 0,
    filesSkipped: 0,
    findings: 0,
    scannerFailures: 0,
    durationMs: 0,
    scannersRun: [],
    scannersSkipped: [],
    ...scanStats
  };

  return [
    '## 3. Source Scan Stats',
    '',
    `- Files scanned: ${stats.filesScanned}`,
    `- Files skipped: ${stats.filesSkipped}`,
    `- Source findings: ${stats.findings}`,
    `- Scanner failures: ${stats.scannerFailures}`,
    `- Duration: ${stats.durationMs}ms`,
    `- Scanners run: ${stats.scannersRun.length ? stats.scannersRun.join(', ') : 'none'}`,
    `- Scanners skipped: ${stats.scannersSkipped.length ? stats.scannersSkipped.join(', ') : 'none'}`,
    ''
  ];
}

function buildScannerFailureSection(scannerResults = []) {
  const failures = scannerResults.filter((result) => result.status === 'failed');
  if (!failures.length) return [];

  const lines = ['## 4. Scanner Failures', ''];
  for (const failure of failures) {
    lines.push(`- **${failure.scanner}** failed on \`${failure.targetDir}\``);
    lines.push(`  - Error: ${failure.error || 'No safe error message provided.'}`);
  }
  lines.push('');
  return lines;
}

function buildPassHistorySection(passes = []) {
  if (!passes.length) return [];

  const lines = [
    '## 5. Pass History',
    '',
    '| Pass | Before | After | Safe repairs | Source findings | Scanner failures | Stop reason |',
    '|------|--------|-------|--------------|-----------------|------------------|-------------|'
  ];

  for (const pass of passes) {
    lines.push([
      `| ${pass.pass}`,
      `${pass.beforeScore} (${pass.beforeBand})`,
      `${pass.afterScore} (${pass.afterBand})`,
      pass.safeRepairsApplied?.length || 0,
      pass.sourceFindings || 0,
      pass.scannerFailures || 0,
      pass.stoppedBecause || 'continued'
    ].join(' | ') + ' |');
  }

  lines.push('');
  return lines;
}

function buildRepairSection(result) {
  const repairs = result.repairs || [];
  const safeRepairs = repairs.filter((repair) => repair.action !== 'code fix not applied');
  const codeFixNotice = repairs.find((repair) => repair.action === 'code fix not applied');
  const lines = ['## 6. Safe Documentation Repairs Applied', ''];

  if (!safeRepairs.length) {
    lines.push('No safe documentation repairs were applied.');
  } else {
    for (const repair of safeRepairs) {
      lines.push(`- **${repair.file}**: ${repair.action}${repair.rule ? ` (\`${repair.rule}\`)` : ''}`);
    }
  }

  if (codeFixNotice || result.codeFixes?.requested) {
    lines.push('', '### Source code fixes');
    lines.push('`--apply-code-fixes` was requested, but source code patching is not implemented yet. Autopilot wrote guidance only and did not rewrite source files.');
  }

  lines.push('');
  return lines;
}

function buildManualSourceSection(evidences) {
  const manual = evidences.filter((e) => e.type !== 'spec' && e.type !== 'harness' && e.type !== 'scanner');
  const lines = ['## 7. Source Code Issues Requiring Manual/Agent Action', ''];

  if (!manual.length) {
    lines.push('No source code issues were reported by the source scanners.');
  } else {
    for (const issue of manual.slice(0, 25)) {
      const loc = issue.file ? `${issue.file}${issue.line ? `:${issue.line}` : ''}` : 'N/A';
      lines.push(`- **${issue.ruleName}** at \`${loc}\`: ${issue.symptom}`);
    }
  }

  lines.push('');
  return lines;
}

export function buildMarkdownReport(result) {
  const summary = result.summary || {};
  const evidences = result.evidences || [];
  const blockers = evidences.filter((e) => e.severity === 'error' || e.severity === 'blocker');
  const topBlockers = blockers.slice(0, 5);

  const lines = [
    '# Unslop Autopilot Report',
    '',
    '## 1. Executive Summary',
    `**Score:** ${summary.score}/100`,
    `**Readiness:** ${summary.readiness || 'unknown'}`,
    `**Stop reason:** ${result.stopReason || 'unknown'}`,
    summary.readinessMessage ? `> **Decision:** ${summary.readinessMessage}` : '',
    '',
    `**Totals:** ${summary.errors} Blockers | ${summary.warnings} Warnings | ${summary.info} Info`,
    '',
    'Autopilot applies safe documentation repairs only. Source code issues remain manual work unless a future source patcher explicitly implements them.',
    ''
  ];

  if (topBlockers.length > 0) {
    lines.push('## 2. Top Blockers', '');
    for (const blocker of topBlockers) {
      lines.push(`- **[\`${blocker.ruleName}\`]** at \`${blocker.file || 'N/A'}\``);
      lines.push(`  - Root cause: ${blocker.likelyRootCause || 'Unknown'}`);
      lines.push(`  - Fix strategy: ${blocker.fixStrategy || 'Review and refactor'}`);
      lines.push(`  - Verify: ${blocker.verificationProof || 'N/A'}`);
    }
    lines.push('');
  }

  lines.push(...buildScanStatsSection(result.scanStats));
  lines.push(...buildScannerFailureSection(result.scannerResults || []));
  lines.push(...buildPassHistorySection(result.passes || []));
  lines.push(...buildRepairSection(result));
  lines.push(...buildManualSourceSection(evidences));
  lines.push('## 8. Evidence Table', '', buildEvidenceTable(evidences), '');
  lines.push(
    '## 9. Verification Notes',
    '',
    'Review PRODUCT.md, DESIGN.md, AGENTS.md, package.json, routing files, component structure, existing tests, and `.unslop/fix-list.md`. Documentation repairs do not prove implementation quality. Run tests, browser QA, accessibility checks, and Unslop again before release.',
    '',
    '## 10. Verification Checklist',
    '- [ ] Build succeeds without errors',
    '- [ ] Tests pass',
    '- [ ] Mobile viewports checked',
    '- [ ] Keyboard navigation and focus traps work',
    '- [ ] RTL layout checked if applicable',
    '- [ ] Overlays and modals render correctly without scroll cutoff'
  );

  return lines.join('\n');
}

export function buildFixList(result) {
  const evidences = result.evidences || [];
  const manualFixes = evidences.filter((e) => e.severity !== 'info' && e.type !== 'spec');
  const summary = result.summary || {};
  const lines = [
    '# Unslop Fix List',
    '',
    `Current readiness: ${summary.readiness || 'unknown'}`,
    `Stop reason: ${result.stopReason || 'unknown'}`,
    summary.readinessMessage ? `Decision: ${summary.readinessMessage}` : '',
    '',
    'Safe documentation repairs may already be applied. Source code changes still require manual review or a coding-agent edit.',
    ''
  ];

  if (result.scanStats) {
    lines.push(`Scan stats: ${result.scanStats.filesScanned} files scanned, ${result.scanStats.findings} findings, ${result.scanStats.scannerFailures} scanner failures.`, '');
  }

  if (result.codeFixes?.requested) {
    lines.push('`--apply-code-fixes` was requested, but source patching is not implemented. Do not assume source files were modified.', '');
  }

  if (manualFixes.length === 0) {
    lines.push('No manual fixes were listed. Still run tests, browser QA, and accessibility checks before release.');
  } else {
    for (const evidence of manualFixes) {
      lines.push(`- [ ] **File**: \`${evidence.file || 'N/A'}\`${evidence.line ? ` (Line: ${evidence.line})` : ''}`);
      lines.push(`  - **Issue**: ${evidence.symptom || evidence.ruleName}`);
      lines.push(`  - **Type**: ${evidence.type || 'unknown'}`);
      if (evidence.likelyRootCause) lines.push(`  - **Root Cause**: ${evidence.likelyRootCause}`);
      if (evidence.fixStrategy) lines.push(`  - **Required Action**: ${evidence.fixStrategy}`);
      lines.push('');
    }
    lines.push('When done, run `npx unslop-preflight autopilot --strict` and confirm the scanner failure count is 0.');
  }

  return lines.join('\n');
}

export function writeReports(cwd, result, flags = {}) {
  const md = buildMarkdownReport(result);
  const fixList = buildFixList(result);
  const safeResult = {
    ...result,
    evidences: result.evidences?.map((e) => e.toReportObject ? e.toReportObject() : e)
  };

  writeText(cwd, '.unslop/report.md', md, flags);
  writeText(cwd, '.unslop/report.json', JSON.stringify(safeResult, null, 2), flags);
  writeText(cwd, '.unslop/fix-list.md', fixList, flags);

  return ['.unslop/report.md', '.unslop/report.json', '.unslop/fix-list.md'];
}
