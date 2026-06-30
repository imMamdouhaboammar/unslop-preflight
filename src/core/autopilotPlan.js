import { fingerprintProject } from './projectFingerprint.js';
import { emptySourceScanMetadata, runSourceScanners } from './sourceScanner.js';
import { runAudit, summarize } from './auditor.js';
import { applyRepairs } from './repair.js';
import { writeReports } from './report.js';
import { convertLegacyIssueToEvidence, Evidence } from './findings.js';
import { planRepairs } from './repairPlanner.js';
import { adviseHarnesses } from './harnessAdvisor.js';

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
  const patch = applyRepairs(cwd, repairPlan, flags);
  const finalAudit = runAudit(cwd);

  const finalIssues = [
    ...finalAudit.issues,
    ...formattedSourceIssues,
    ...scannerFailures,
    ...harnessRecommendations
  ];

  const result = summarize({
    ...finalAudit,
    issues: finalIssues,
    ...patch,
    fingerprint,
    sourceScanEnabled: sourceScanEnabled(flags),
    scannerFindings: sourceFindings,
    scannerResults: metadata.scannerResults,
    scanStats: metadata.scanStats,
    codeFixes: patch.codeFixes
  });

  result.issues = result.evidences.map(toPrintableIssue);

  return {
    pass,
    before,
    result,
    repairPlan,
    patch,
    sourceFindings,
    metadata
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
  const maxPasses = maxPassesFor(flags);
  const passes = [];
  const allGenerated = [];
  const allChanged = [];
  const allRepairs = [];
  let finalResult = null;
  let stopReason = 'max-passes';

  for (let pass = 1; pass <= maxPasses; pass++) {
    const cycle = runSinglePass(cwd, flags, pass);
    const reason = stopReasonFor(cycle, pass, maxPasses, flags);

    allGenerated.push(...(cycle.patch.generated || []));
    allChanged.push(...(cycle.patch.changed || []));
    allRepairs.push(...(cycle.patch.repairs || []));

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

  finalResult.generated = unique(allGenerated);
  finalResult.changed = unique(allChanged);
  finalResult.repairs = allRepairs;
  finalResult.passes = passes;
  finalResult.stopReason = stopReason;
  finalResult.codeFixes ||= {
    requested: codeFixesRequested(flags),
    applied: false,
    reason: codeFixesRequested(flags) ? 'not-implemented' : 'not-requested'
  };
  finalResult.reportFiles = writeReports(cwd, finalResult, flags);
  finalResult.exitCode = exitCodeFor(finalResult);
  finalResult.nextCommand = finalResult.summary.errors > 0
    ? 'npx unslop-preflight scan --strict'
    : 'npx unslop-preflight audit --strict';
  finalResult.suggestedPrompt = 'Review `.unslop/report.md` and `.unslop/fix-list.md`. Apply manual source fixes separately; autopilot only applies safe documentation repairs.';

  return finalResult;
}
