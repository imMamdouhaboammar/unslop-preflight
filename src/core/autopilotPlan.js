import { fingerprintProject } from './projectFingerprint.js';
import { emptySourceScanMetadata, runSourceScanners } from './sourceScanner.js';
import { runAudit, summarize } from './auditor.js';
import { applyRepairs } from './repair.js';
import { writeReports } from './report.js';
import { convertLegacyIssueToEvidence, Evidence } from './findings.js';
import { planRepairs } from './repairPlanner.js';
import { adviseHarnesses } from './harnessAdvisor.js';
import { runSourceFixEngine } from './sourceFixEngine.js';
import { runVerification } from './verify.js';
import { verifyScoringIntegrity } from './integrity.js';

function flagValue(flags = {}, camelName, kebabName) {
  return flags[camelName] ?? flags[kebabName];
}

function sourceScanEnabled(flags = {}) {
  return flags.sourceScan !== false
    && flags.noSourceScan !== true
    && flags['no-source-scan'] !== true;
}

function codeFixesRequested(flags = {}) {
  return Boolean(flags.applyCodeFixes || flags['apply-code-fixes']);
}

export function getRepairMode(flags = {}) {
  if (flags.planOnly || flags['plan-only']) return 'plan-only';
  if (flags.safeFix || flags['safe-fix']) return 'safe-fix';
  if (flags.agentFix || flags['agent-fix']) return 'agent-fix';
  if (flags.docFix || flags['doc-fix']) return 'doc-fix';
  return 'doc-fix';
}

function maxPassesFor(flags = {}) {
  const raw = flagValue(flags, 'maxPasses', 'max-passes') ?? 1;
  const parsed = Number.parseInt(raw, 10);

  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, 10);
}

function toSourceEvidence(finding) {
  return new Evidence({
    ruleName: finding.rule,
    symptom: finding.excerpt,
    likelyRootCause: 'Code implementation error or omission',
    evidenceSnippet: finding.excerpt,
    file: finding.file,
    line: finding.line,
    fixStrategy: 'Fix the flagged source-level pattern, then rerun `npx unslop-preflight scan` or `npx unslop-preflight autopilot`.',
    confidence: 'high',
    impact: finding.level === 'blocker' ? 'accessibility break' : 'visual break',
    severity: finding.level === 'blocker' ? 'error' : finding.level || 'warning',
    effort: 'small',
    type: finding.type || 'code'
  });
}

function toScannerFailureEvidence(failure, strict = false) {
  return new Evidence({
    ruleName: `scanner-failed:${failure.scanner}`,
    symptom: `${failure.scanner} scanner failed for ${failure.targetDir}`,
    likelyRootCause: 'A source scanner crashed or could not read the target path.',
    evidenceSnippet: failure.error || 'Scanner failed without details.',
    file: failure.targetDir,
    fixStrategy: 'Fix the scanner input path or scanner failure, then rerun `npx unslop-preflight autopilot`.',
    verificationProof: 'Rerun `npx unslop-preflight autopilot --strict` and confirm scannerFailures is 0.',
    confidence: 'high',
    impact: 'agent-risk',
    severity: strict ? 'error' : 'warning',
    effort: 'small',
    type: 'scanner'
  });
}

function toPrintableIssue(evidence) {
  return {
    id: evidence.ruleName,
    title: evidence.symptom,
    category: evidence.type || 'code',
    severity: evidence.severity === 'blocker' ? 'error' : evidence.severity,
    file: evidence.file,
    line: evidence.line,
    excerpt: evidence.evidenceSnippet,
    suggestedFix: evidence.fixStrategy,
    repairability: evidence.type === 'spec' ? 'safe-doc-repair' : 'manual',
    type: evidence.type
  };
}

function safeRepairSummary(repairs = []) {
  return repairs
    .filter((repair) => repair.action !== 'code fix not applied')
    .map((repair) => ({
      file: repair.file,
      rule: repair.rule,
      action: repair.action
    }));
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function runSourceScan(cwd, fingerprint, flags) {
  if (!sourceScanEnabled(flags)) {
    return {
      sourceFindings: [],
      metadata: emptySourceScanMetadata()
    };
  }

  const sourceFindings = runSourceScanners(cwd, fingerprint, flags);
  return {
    sourceFindings,
    metadata: sourceFindings.metadata || emptySourceScanMetadata('metadata-missing')
  };
}

function runSinglePass(cwd, flags, pass) {
  const fingerprint = fingerprintProject(cwd);
  const firstAudit = runAudit(cwd);
  const { sourceFindings, metadata } = runSourceScan(cwd, fingerprint, flags);
  const formattedSourceIssues = sourceFindings.map(toSourceEvidence);
  const scannerFailures = (metadata.scannerResults || [])
    .filter((result) => result.status === 'failed')
    .map((failure) => toScannerFailureEvidence(failure, Boolean(flags.strict)));
  const harnessRecommendations = adviseHarnesses(fingerprint);

  const initialEvidences = [
    ...firstAudit.issues.map((issue) => convertLegacyIssueToEvidence(issue, issue.type || 'spec')),
    ...formattedSourceIssues,
    ...scannerFailures,
    ...harnessRecommendations
  ];

  const before = summarize({
    issues: initialEvidences,
    generated: [],
    changed: [],
    repairs: [],
    fingerprint,
    scannerResults: metadata.scannerResults,
    scanStats: metadata.scanStats
  });

  const repairPlan = planRepairs(initialEvidences);
  const repairMode = getRepairMode(flags);

  // Apply repairs (safe documentation repairs only)
  // If we are in plan-only mode, pass dryRun: true to applyRepairs
  const appRepairFlags = (repairMode === 'plan-only') ? { ...flags, dryRun: true } : flags;
  const patch = applyRepairs(cwd, repairPlan, appRepairFlags);

  // Run source code fixes if safe-fix is enabled
  let sourceFixes = { applied: [], skipped: [], failed: [] };
  if (repairMode === 'safe-fix') {
    const fixFlags = { ...flags, safeFix: true, 'safe-fix': true, repairMode };
    sourceFixes = runSourceFixEngine(cwd, sourceFindings, fixFlags);
  } else {
    const previewFlags = { ...flags, dryRun: true, 'dry-run': true, repairMode };
    sourceFixes = runSourceFixEngine(cwd, sourceFindings, previewFlags);
  }

  // Run verification if flags.verify is enabled
  let verificationResults = [];
  if (flags.verify && (repairMode === 'safe-fix' || repairMode === 'doc-fix')) {
    verificationResults = runVerification(cwd, flags);
  }

  // If source fixes were applied, trigger a re-scan!
  let finalSourceFindings = sourceFindings;
  let finalMetadata = metadata;
  let finalAudit = firstAudit;

  if (sourceFixes.applied.length > 0 && repairMode === 'safe-fix') {
    const finalScan = runSourceScan(cwd, fingerprint, flags);
    finalSourceFindings = finalScan.sourceFindings;
    finalMetadata = finalScan.metadata;
    finalAudit = runAudit(cwd);
  } else if (repairMode !== 'plan-only') {
    finalAudit = runAudit(cwd);
  }

  const finalSourceIssuesFormatted = finalSourceFindings.map(toSourceEvidence);
  const finalScannerFailures = (finalMetadata.scannerResults || [])
    .filter((result) => result.status === 'failed')
    .map((failure) => toScannerFailureEvidence(failure, Boolean(flags.strict)));

  const finalIssues = [
    ...finalAudit.issues,
    ...finalSourceIssuesFormatted,
    ...finalScannerFailures,
    ...harnessRecommendations
  ];

  const result = summarize({
    ...finalAudit,
    issues: finalIssues,
    ...patch,
    fingerprint,
    sourceScanEnabled: sourceScanEnabled(flags),
    scannerFindings: finalSourceFindings,
    scannerResults: finalMetadata.scannerResults,
    scanStats: finalMetadata.scanStats,
    codeFixes: patch.codeFixes
  });

  result.issues = result.evidences.map(toPrintableIssue);

  // Attach sourceFixes and verificationResults onto the result
  result.appliedFixes = sourceFixes.applied;
  result.skippedFixes = sourceFixes.skipped;
  result.failedFixes = sourceFixes.failed;
  result.verificationResults = verificationResults;

  return {
    pass,
    before,
    result,
    repairPlan,
    patch,
    sourceFindings: finalSourceFindings,
    metadata: finalMetadata,
    sourceFixes,
    verificationResults
  };
}

function stopReasonFor(cycle, pass, maxPasses, flags = {}) {
  const { before, result, patch, repairPlan, metadata } = cycle;

  if (flags.strict && metadata.scanStats?.scannerFailures > 0) {
    return 'error';
  }

  if (result.summary?.readiness === 'agent-ready') {
    return 'agent-ready';
  }

  if (safeRepairSummary(patch.repairs).length === 0 && (repairPlan.safeDocs || []).length === 0) {
    return 'no-safe-repairs';
  }

  if ((result.summary?.score ?? 0) <= (before.summary?.score ?? 0)) {
    return 'no-score-improvement';
  }

  if (pass >= maxPasses) {
    return 'max-passes';
  }

  return null;
}

function exitCodeFor(result) {
  const errors = result.issues.filter((issue) => issue.severity === 'error' || issue.severity === 'blocker').length;

  if (errors > 0) return 1;
  if (result.summary.readiness === 'needs-spec-work') return 2;
  return 0;
}

export function runAutopilotPipeline(cwd, flags = {}) {
  verifyScoringIntegrity();
  const maxPasses = maxPassesFor(flags);
  const passes = [];
  const allGenerated = [];
  const allChanged = [];
  const allRepairs = [];

  const allAppliedFixes = [];
  const allSkippedFixes = [];
  const allFailedFixes = [];
  const allVerificationResults = [];

  let finalResult = null;
  let stopReason = 'max-passes';

  let initialScore = undefined;
  let initialBlockers = undefined;
  let initialSourceFindings = undefined;

  for (let pass = 1; pass <= maxPasses; pass++) {
    const cycle = runSinglePass(cwd, flags, pass);
    const reason = stopReasonFor(cycle, pass, maxPasses, flags);

    if (pass === 1) {
      initialScore = cycle.before.summary.score;
      initialBlockers = cycle.before.summary.errors;
      initialSourceFindings = cycle.sourceFindings.length;
    }

    allGenerated.push(...(cycle.patch.generated || []));
    allChanged.push(...(cycle.patch.changed || []));
    allRepairs.push(...(cycle.patch.repairs || []));

    if (cycle.result.appliedFixes) {
      allAppliedFixes.push(...cycle.result.appliedFixes);
    }
    if (cycle.result.skippedFixes) {
      allSkippedFixes.push(...cycle.result.skippedFixes);
    }
    if (cycle.result.failedFixes) {
      allFailedFixes.push(...cycle.result.failedFixes);
    }
    if (cycle.result.verificationResults) {
      allVerificationResults.push(...cycle.result.verificationResults);
    }

    passes.push({
      pass,
      beforeScore: cycle.before.summary.score,
      afterScore: cycle.result.summary.score,
      beforeBand: cycle.before.summary.readiness,
      afterBand: cycle.result.summary.readiness,
      safeRepairsApplied: safeRepairSummary(cycle.patch.repairs),
      sourceFindings: cycle.sourceFindings.length,
      scannerFailures: cycle.metadata.scanStats?.scannerFailures || 0,
      stoppedBecause: reason
    });

    finalResult = cycle.result;

    if (reason) {
      stopReason = reason;
      break;
    }
  }

  if (finalResult) {
    finalResult.generated = unique(allGenerated);
    finalResult.changed = unique(allChanged);
    finalResult.repairs = allRepairs;
    finalResult.passes = passes;
    finalResult.stopReason = stopReason;

    finalResult.appliedFixes = allAppliedFixes;
    finalResult.skippedFixes = allSkippedFixes;
    finalResult.failedFixes = allFailedFixes;
    finalResult.verificationResults = allVerificationResults;

    finalResult.initialScore = initialScore;
    finalResult.initialBlockers = initialBlockers;
    finalResult.initialSourceFindings = initialSourceFindings ?? 0;

    finalResult.codeFixes ||= {
      requested: codeFixesRequested(flags),
      applied: false,
      reason: codeFixesRequested(flags) ? 'not-implemented' : 'not-requested'
    };
    if (flags.standards) {
      finalResult.selectedStandards = flags.standards;
    }
    finalResult.reportFiles = writeReports(cwd, finalResult, flags);
    finalResult.exitCode = exitCodeFor(finalResult);
    finalResult.nextCommand = finalResult.summary.errors > 0
      ? 'npx unslop-preflight scan --strict'
      : 'npx unslop-preflight audit --strict';

    const repairMode = getRepairMode(flags);
    if (repairMode === 'safe-fix') {
      finalResult.suggestedPrompt = 'Review `.unslop/report.md` and `.unslop/patch-summary.md`. Automatic fixes have been applied and verified; run remaining manual checks.';
    } else if (repairMode === 'agent-fix') {
      finalResult.suggestedPrompt = 'A customized coding agent prompt has been written to `.unslop/agent-fix-prompt.md`. Pass it to your agent to resolve the remaining source issues.';
    } else {
      finalResult.suggestedPrompt = 'Review `.unslop/report.md` and `.unslop/fix-list.md`. Apply manual source fixes separately; autopilot only applies safe documentation repairs.';
    }
  }

  return finalResult;
}
