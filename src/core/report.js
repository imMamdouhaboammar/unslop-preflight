import { writeText } from './filesystem.js';
import { loadStandardsPack } from './standardsPacks.js';


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

function buildBeforeAfterSection(result) {
  const initialScore = result.initialScore ?? 0;
  const finalScore = result.summary?.score ?? 0;
  const initialBlockers = result.initialBlockers ?? 0;
  const finalBlockers = result.summary?.errors ?? 0;
  const initialSourceFindings = result.initialSourceFindings ?? 0;
  const finalSourceFindings = result.scanStats?.findings ?? 0;

  const scoreDelta = finalScore - initialScore;
  const blockerDelta = initialBlockers - finalBlockers;
  const findingsDelta = initialSourceFindings - finalSourceFindings;

  return [
    '## Before / After',
    '',
    '| Metric | Before | After | Delta |',
    '| :--- | :---: | :---: | :---: |',
    `| **Unslop Score** | \`${initialScore}/100\` | \`${finalScore}/100\` | **${scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}** |`,
    `| **Blockers / Errors** | \`${initialBlockers}\` | \`${finalBlockers}\` | **${blockerDelta >= 0 ? `-${blockerDelta}` : `+${Math.abs(blockerDelta)}`}** |`,
    `| **Source Findings** | \`${initialSourceFindings}\` | \`${finalSourceFindings}\` | **${findingsDelta >= 0 ? `-${findingsDelta}` : `+${Math.abs(findingsDelta)}`}** |`,
    ''
  ].join('\n');
}

function buildVerificationSection(result) {
  const results = result.verificationResults || [];
  if (!results.length) return '';

  const lines = ['## Verification Results', ''];
  lines.push('| Command | Status | Duration | Exit Code | Summary |');
  lines.push('|---------|--------|----------|-----------|---------|');
  for (const r of results) {
    const briefSummary = String(r.summary || '').slice(0, 150).replace(/\n/g, ' ');
    lines.push(`| \`${r.command}\` | **${String(r.status).toUpperCase()}** | ${r.durationMs}ms | ${r.exitCode} | ${escapeTableCell(briefSummary)} |`);
  }
  lines.push('');
  return lines.join('\n');
}

export function buildMarkdownReport(result, flags = {}) {
  const summary = result.summary || {};
  const evidences = result.evidences || [];
  const blockers = evidences.filter((e) => e.severity === 'error' || e.severity === 'blocker');
  const topBlockers = blockers.slice(0, 5);

  let standardsLine = '';
  if (flags.standards) {
    try {
      const { manifest } = loadStandardsPack(flags.standards);
      standardsLine = `${manifest.name} (\`${flags.standards}\`)`;
    } catch (e) {
      standardsLine = `\`${flags.standards}\``;
    }
  }

  let modeMessage = 'Autopilot applies safe documentation repairs only. Source code issues remain manual work unless a future source patcher explicitly implements them.';
  const repairMode = flags.repairMode || (flags.safeFix || flags['safe-fix'] ? 'safe-fix' : flags.planOnly || flags['plan-only'] ? 'plan-only' : 'doc-fix');
  if (repairMode === 'safe-fix') {
    modeMessage = 'Autopilot was executed in **safe-fix** mode. It applied safe, low-risk deterministic source code fixes and verified them against available project checks.';
  } else if (repairMode === 'plan-only') {
    modeMessage = 'Autopilot was executed in **plan-only** mode. No files were written; only scans and readiness score calculation were performed.';
  }

  const lines = [
    '# Unslop Autopilot Report',
    '',
    '## 1. Executive Summary',
    `**Score:** ${summary.score}/100`,
    `**Readiness:** ${summary.readiness || 'unknown'}`,
    `**Stop reason:** ${result.stopReason || 'unknown'}`,
    summary.readinessMessage ? `> **Decision:** ${summary.readinessMessage}` : '',
    standardsLine ? `> **Enforced Standards:** ${standardsLine}` : '',
    '',
    `**Totals:** ${summary.errors} Blockers | ${summary.warnings} Warnings | ${summary.info} Info`,
    '',
    modeMessage,
    ''
  ];

  if (result.initialScore !== undefined) {
    lines.push(buildBeforeAfterSection(result));
  }

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
  
  const verSec = buildVerificationSection(result);
  if (verSec) {
    lines.push(verSec);
  }

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

export function buildFixList(result, flags = {}) {
  const evidences = result.evidences || [];
  const manualFixes = evidences.filter((e) => e.severity !== 'info' && e.type !== 'spec');
  const summary = result.summary || {};
  let standardsLine = '';
  if (flags.standards) {
    try {
      const { manifest } = loadStandardsPack(flags.standards);
      standardsLine = `${manifest.name} (\`${flags.standards}\`)`;
    } catch (e) {
      standardsLine = `\`${flags.standards}\``;
    }
  }
  const lines = [
    'You are an expert AI frontend engineer.',
    '# Unslop Fix List',
    '',
    `Current readiness: ${summary.readiness || 'unknown'}`,
    `Stop reason: ${result.stopReason || 'unknown'}`,
    summary.readinessMessage ? `Decision: ${summary.readinessMessage}` : '',
    standardsLine ? `Enforced Standards: ${standardsLine}` : '',
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

export function generateUnifiedDiff(original = '', replacement = '') {
  const originalLines = original.split(/\r?\n/);
  const replacementLines = replacement.split(/\r?\n/);

  const n = originalLines.length;
  const m = replacementLines.length;

  const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (originalLines[i - 1] === replacementLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diffLines = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalLines[i - 1] === replacementLines[j - 1]) {
      diffLines.unshift(`  ${originalLines[i - 1]}`);
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diffLines.unshift(`+ ${replacementLines[j - 1]}`);
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diffLines.unshift(`- ${originalLines[i - 1]}`);
      i--;
    }
  }

  return diffLines.join('\n');
}

export function buildAgentFixPrompt(result, flags = {}) {
  const evidences = result.evidences || [];
  const manualFixes = evidences.filter((e) => e.severity !== 'info' && e.type !== 'spec');
  const summary = result.summary || {};
  
  let standardsLine = 'None';
  if (flags.standards || result.selectedStandards) {
    standardsLine = flags.standards || result.selectedStandards;
  }

  const errors = manualFixes.filter((e) => e.severity === 'error' || e.severity === 'blocker');
  const warnings = manualFixes.filter((e) => e.severity === 'warning');

  const formatIssue = (e) => {
    const loc = e.file ? `\`${e.file}\`${e.line ? ` (Line: ${e.line})` : ''}` : 'N/A';
    return [
      `### 🔍 Issue: ${e.symptom || e.ruleName}`,
      `- **Rule ID**: \`${e.ruleName}\``,
      `- **Target File**: ${loc}`,
      `- **Type**: \`${e.type || 'code'}\``,
      e.likelyRootCause ? `- **Root Cause**: ${e.likelyRootCause}` : '',
      e.fixStrategy ? `- **Required Fix Strategy**: ${e.fixStrategy}` : '',
      e.verificationProof ? `- **Verification Proof**: ${e.verificationProof}` : '',
    ].filter(Boolean).join('\n');
  };

  const errorsList = errors.length > 0 
    ? errors.map(formatIssue).join('\n\n---\n\n') 
    : '*No blockers or error-level issues reported. Excellent work!*';

  const warningsList = warnings.length > 0 
    ? warnings.map(formatIssue).join('\n\n---\n\n') 
    : '*No warning-level issues reported.*';

  return `# 🛠️ Unslop Agent Fix Prompt

You have been hired as a Senior Frontend & Accessibility Engineering Agent to clean up AI slop, resolve regression issues, and harden the UI/UX codebase of this project.

Your task is to systematically inspect the reported issues, fix the corresponding source code files, and verify that the application remains robust.

---

## 📋 Project Status

- **Quality Score**: ${summary.score || 0}/100
- **Readiness Level**: \`${summary.readiness || 'unknown'}\`
- **Enforced Standards Pack**: \`${standardsLine}\`
- **Stop Reason**: \`${result.stopReason || 'unknown'}\`
- **Decision Verdict**: *${summary.readinessMessage || 'None'}*

> [!IMPORTANT]
> **Safe repairs have already been applied to your markdown specs (\`PRODUCT.md\`, \`DESIGN.md\`, \`AGENTS.md\`).**
> Your focus is strictly on fixing the remaining **source-level** code issues and code anomalies listed below.

---

## 🛑 Blockers & Errors (Requires Immediate Action: ${errors.length})

These are high-value failures and slop patterns that violate our strict quality gates. You MUST fix every single one of these.

${errorsList}

---

## ⚠️ Warnings & Potential Slop (Requires Audit: ${warnings.length})

These represent architectural deviations, missing fallback states, layout risks, or code anomalies. Inspect each one and resolve it where appropriate.

${warningsList}

---

## 🛡️ Strict AI Safety Rules (No-Exceptions)

To prevent code regression, chaotic refactoring, or destructive editing, you MUST follow these guidelines:

1. **Inspect before modifying**: Open and read the target file fully before editing to understand its exact context.
2. **Preserve existing logic & structure**: Do not delete existing features, rename public API routes, or alter unrelated files.
3. **Preserve documentation, comments, and docstrings**: Never delete explanatory code comments or documentation.
4. **No ad-hoc styling hacks**: Do not add random inline styles or introduce brand-new CSS frameworks. Use the design tokens and system specified in \`DESIGN.md\`.
5. **No placeholders**: Do not leave \`// TODO\` or placeholder code. Implement complete, production-quality fixes.

---

## 🧪 Post-Fix Verification Checklist

After applying your fixes, you MUST verify your changes by executing these checks locally:

- [ ] **Build Check**: Run \`npm run build\` (or the project's build command) to ensure the bundle compiles cleanly.
- [ ] **Test Coverage**: Run \`npm test\` (or the project's test runner) to assert that zero tests are broken.
- [ ] **Keyboard Navigation**: Verify keyboard focus states are visible and focus traps in overlays (modals/drawers) work.
- [ ] **Mobile Responsive Layout**: Ensure there is no horizontal layout overflow on narrow viewports.
- [ ] **Unslop Verification**: Rerun Unslop Preflight in strict mode to confirm a clean pass:
  \`\`\`bash
  npx unslop-preflight autopilot --strict
  \`\`\`
  Ensure the final score increases and there are **0 Blockers / Errors** remaining.
`;
}

export function writeSourceFixesJson(cwd, appliedFixes, skippedFixes, flags = {}) {
  const data = {
    generationTime: new Date().toISOString(),
    projectCwd: cwd,
    appliedPatches: appliedFixes.map((f, idx) => ({
      patchId: f.id || `patch_${Date.now()}_${idx}`,
      ruleName: f.findingId,
      file: f.file,
      lineRange: { start: 1, end: f.changedLines },
      symptom: `Finding matching rule '${f.findingId}'`,
      originalContent: f.beforeSnippet,
      replacementContent: f.afterSnippet,
      rationale: `Applied safe, deterministic fixer for ${f.findingId}`,
      verificationCommand: `npx unslop-preflight scan --rule ${f.findingId}`
    })),
    skippedPatches: skippedFixes.map(f => ({
      ruleName: f.findingId || f.rule || 'unknown',
      file: f.file,
      symptom: f.beforeSnippet || 'High-risk or complex layout slop finding',
      reason: f.reason,
      fixStrategy: f.fixStrategy || 'Handle manually'
    }))
  };

  writeText(cwd, '.unslop/source-fixes.json', JSON.stringify(data, null, 2), flags);
  return '.unslop/source-fixes.json';
}

export function writeSourceFixesMarkdown(cwd, appliedFixes, skippedFixes, flags = {}) {
  const lines = [
    '# Unslop Source Fixes Report',
    '',
    'This document records the exact source code edits applied by Unslop Preflight Autopilot, along with detailed explanations and verification strategies.',
    '',
    '## Modification Ledger',
    `- **Applied Patches:** ${appliedFixes.length}`,
    `- **Skipped Patches:** ${skippedFixes.length}`,
    '',
    '---',
    ''
  ];

  if (appliedFixes.length === 0) {
    lines.push('## Applied Source Patches', '', 'No automatic source patches were applied in this run.', '');
  } else {
    lines.push('## Applied Source Patches', '');
    for (let idx = 0; idx < appliedFixes.length; idx++) {
      const fix = appliedFixes[idx];
      const diff = generateUnifiedDiff(fix.beforeSnippet, fix.afterSnippet);
      lines.push(
        `### [Applied] \`${fix.findingId}\``,
        `- **File:** \`${fix.file}\``,
        `- **Symptom:** Finding matching rule '${fix.findingId}'`,
        '',
        '#### Unified Diff representation:',
        '```diff',
        diff,
        '```',
        '',
        `**Rationale:** Applied safe, deterministic fixer for ${fix.findingId}`,
        `**Verification:** Run \`npx unslop-preflight scan\` to confirm correct syntax and alignment.`,
        '',
        '---',
        ''
      );
    }
  }

  if (skippedFixes.length > 0) {
    lines.push('## Skipped Patches (Safe / Defensive Omissions)', '');
    for (const skip of skippedFixes) {
      lines.push(
        `### [Skipped] \`${skip.findingId || skip.rule || 'unknown'}\``,
        `- **File:** \`${skip.file}\``,
        `- **Reason for Omission:** ${skip.reason}`,
        `- **Recommended Fix Strategy:** ${skip.fixStrategy || 'Handle manually'}`,
        '',
        '---'
      );
    }
  }

  writeText(cwd, '.unslop/source-fixes.md', lines.join('\n'), flags);
  return '.unslop/source-fixes.md';
}

export function writePatchSummaryMarkdown(cwd, result, flags = {}) {
  const initialScore = result.initialScore ?? 0;
  const finalScore = result.summary?.score ?? 0;
  const scoreDelta = finalScore - initialScore;
  const scoreDeltaMarker = scoreDelta >= 0 ? `+${scoreDelta}` : `${scoreDelta}`;
  const scoreStatus = scoreDelta > 0 ? '🟢 IMPROVED' : scoreDelta === 0 ? '⚪ NO CHANGE' : '🔴 REGRESSED';
  
  const initialBlockers = result.initialBlockers ?? 0;
  const finalBlockers = result.summary?.errors ?? 0;
  const blockersResolved = Math.max(0, initialBlockers - finalBlockers);

  const readinessStatus = result.summary?.readiness === 'agent-ready' ? '🟢 READY FOR AGENT' : '🟡 NEEDS WORK';

  const appliedFixes = result.appliedFixes || [];
  const skippedFixes = result.skippedFixes || [];

  const lines = [
    '# Unslop Patch Summary',
    '',
    '## Executive Dashboard',
    '',
    '| Metric | Before Autopilot | After Autopilot | Change | Status |',
    '| :--- | :---: | :---: | :---: | :--- |',
    `| **Unslop Score** | \`${initialScore}/100\` | \`${finalScore}/100\` | **${scoreDeltaMarker}** | ${scoreStatus} |`,
    `| **Readiness Band** | \`${(result.passes?.[0]?.beforeBand || 'needs-work').toUpperCase()}\` | \`${(result.summary?.readiness || 'needs-work').toUpperCase()}\` | ➡️ | ${readinessStatus} |`,
    `| **Blockers / Errors** | \`${initialBlockers}\` | \`${finalBlockers}\` | **-${blockersResolved}** | ${finalBlockers === 0 ? '🟢 ZERO BLOCKERS' : '🔴 ACTION REQUIRED'} |`,
    '',
    '---',
    '',
    '## Code Modification Ledger',
    '',
    `Total of **${appliedFixes.length}** source file patches were automatically applied. **${skippedFixes.length}** files were skipped defensively to prevent unintended code breaks.`,
    ''
  ];

  if (appliedFixes.length > 0) {
    lines.push('### Patches Applied Successfully:');
    appliedFixes.forEach((a, idx) => {
      lines.push(`${idx + 1}. **${a.findingId}** inside \`${a.file}\``);
    });
    lines.push('');
  }

  if (skippedFixes.length > 0) {
    lines.push('### Complex / High-Risk Areas Skipped (Requires Manual Edits):');
    skippedFixes.forEach((s, idx) => {
      lines.push(`${idx + 1}. **${s.findingId || s.rule || 'unknown'}** inside \`${s.file}\` — *Reason:* ${s.reason}`);
    });
    lines.push('');
  }

  lines.push(
    '---',
    '',
    '## Next Steps & Verification Checklist',
    '',
    'To guarantee your changes did not introduce regression, complete the following validation checklist:',
    ''
  );

  const checklist = [
    { task: "Build succeeds without errors", detail: "Run command: `npm run build`" },
    { task: "Tests pass", detail: "Run command: `npm test`" }
  ];

  appliedFixes.forEach((f, idx) => {
    checklist.push({
      task: `Verify fix for rule '${f.findingId}' in ${f.file}`,
      detail: `Run check command: \`npx unslop-preflight scan --rule ${f.findingId}\``
    });
  });

  skippedFixes.forEach((f, idx) => {
    checklist.push({
      task: `Manually review and resolve skipped rule '${f.findingId || f.rule || 'unknown'}' in ${f.file}`,
      detail: `Required proof: *${f.fixStrategy || "Review code and apply fix manually"}*`
    });
  });

  checklist.forEach(item => {
    lines.push(`- [ ] **${item.task}**`);
    lines.push(`  - *How to verify:* ${item.detail}`);
    lines.push('');
  });

  writeText(cwd, '.unslop/patch-summary.md', lines.join('\n'), flags);
  return '.unslop/patch-summary.md';
}

export function writeReports(cwd, result, flags = {}) {
  const md = buildMarkdownReport(result, flags);
  const fixList = buildFixList(result, flags);
  
  const initialScore = result.initialScore ?? result.summary?.score ?? 0;
  const finalScore = result.summary?.score ?? 0;
  const initialBlockers = result.initialBlockers ?? result.summary?.errors ?? 0;
  const finalBlockers = result.summary?.errors ?? 0;
  const initialSourceFindings = result.initialSourceFindings ?? result.scanStats?.findings ?? 0;
  const finalSourceFindings = result.scanStats?.findings ?? 0;

  const appliedFixes = result.appliedFixes || [];
  const skippedFixes = result.skippedFixes || [];
  const verificationResults = result.verificationResults || [];

  const verificationPassed = verificationResults.length > 0 
    ? verificationResults.every(r => r.status === 'passed' || r.status === 'skipped')
    : true;

  const beforeAfterBlock = {
    initialScore,
    finalScore,
    scoreDelta: finalScore - initialScore,
    initialBlockers,
    finalBlockers,
    blockerDelta: initialBlockers - finalBlockers,
    initialSourceFindings,
    finalSourceFindings,
    sourceFindingDelta: initialSourceFindings - finalSourceFindings,
    sourceFixesApplied: appliedFixes.length,
    sourceFixesSkipped: skippedFixes.length,
    verificationPassed
  };

  const safeResult = {
    ...result,
    beforeAfter: beforeAfterBlock,
    standards: flags.standards || null,
    evidences: result.evidences?.map((e) => e.toReportObject ? e.toReportObject() : e)
  };

  writeText(cwd, '.unslop/report.md', md, flags);
  writeText(cwd, '.unslop/report.json', JSON.stringify(safeResult, null, 2), flags);
  writeText(cwd, '.unslop/fix-list.md', fixList, flags);

  const filesWritten = [
    '.unslop/report.md',
    '.unslop/report.json',
    '.unslop/fix-list.md'
  ];

  const isSafeFixMode = (flags.safeFix || flags['safe-fix'] || flags.repairMode === 'safe-fix');
  
  // Phase 8: Always write source-fixes reports when autopilot executes
  const fJson = writeSourceFixesJson(cwd, appliedFixes, skippedFixes, flags);
  const fMd = writeSourceFixesMarkdown(cwd, appliedFixes, skippedFixes, flags);
  const fSummary = writePatchSummaryMarkdown(cwd, safeResult, flags);

  filesWritten.push('.unslop/source-fixes.json');
  filesWritten.push('.unslop/source-fixes.md');
  filesWritten.push('.unslop/patch-summary.md');

  // Phase 9: Write agent-fix-prompt.md in agent-fix mode
  const repairMode = flags.repairMode || (flags.safeFix || flags['safe-fix'] ? 'safe-fix' : flags.planOnly || flags['plan-only'] ? 'plan-only' : flags.agentFix || flags['agent-fix'] ? 'agent-fix' : 'doc-fix');
  if (repairMode === 'agent-fix') {
    const promptContent = buildAgentFixPrompt(safeResult, flags);
    writeText(cwd, '.unslop/agent-fix-prompt.md', promptContent, flags);
    filesWritten.push('.unslop/agent-fix-prompt.md');
  }

  return filesWritten;
}
