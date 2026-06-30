import { fingerprintProject } from './projectFingerprint.js';
import { runSourceScanners } from './sourceScanner.js';
import { runAudit, summarize } from './auditor.js';
import { applyRepairs } from './repair.js';
import { writeReports } from './report.js';
import { convertLegacyIssueToEvidence, Evidence } from './findings.js';
import { planRepairs } from './repairPlanner.js';
import { adviseHarnesses } from './harnessAdvisor.js';

function sourceScanEnabled(flags = {}) {
  return flags.sourceScan !== false && flags.noSourceScan !== true;
}

function toSourceEvidence(finding) {
  return new Evidence({
    ruleName: finding.rule,
    symptom: finding.excerpt,
    likelyRootCause: 'Code implementation error or omission',
    evidenceSnippet: finding.excerpt,
    file: finding.file,
    line: finding.line,
    fixStrategy: 'Fix the flagged source-level pattern, then rerun `unslop scan` or `unslop autopilot`.',
    confidence: 'high',
    impact: finding.level === 'blocker' ? 'accessibility break' : 'visual break',
    severity: finding.level === 'blocker' ? 'error' : finding.level || 'warning',
    effort: 'small',
    type: 'code'
  });
}

export function runAutopilotPipeline(cwd, flags = {}) {
  const fingerprint = fingerprintProject(cwd);
  const firstAudit = runAudit(cwd);

  const sourceIssues = sourceScanEnabled(flags) ? runSourceScanners(cwd, fingerprint) : [];
  const formattedSourceIssues = sourceIssues.map(toSourceEvidence);
  const harnessRecommendations = adviseHarnesses(fingerprint);

  const allInitialEvidences = [
    ...firstAudit.issues.map(i => convertLegacyIssueToEvidence(i, i.type || 'spec')),
    ...formattedSourceIssues,
    ...harnessRecommendations
  ];

  const repairPlan = planRepairs(allInitialEvidences);
  const patch = applyRepairs(cwd, repairPlan, flags);
  const finalAudit = runAudit(cwd);
  const finalIssues = [...finalAudit.issues, ...formattedSourceIssues, ...harnessRecommendations];
  const result = summarize({ ...finalAudit, issues: finalIssues, ...patch, fingerprint, sourceScanEnabled: sourceScanEnabled(flags) });

  result.reportFiles = writeReports(cwd, result, flags);

  const errors = result.issues.filter(i => i.severity === 'error' || i.severity === 'blocker').length;
  if (errors > 0) result.exitCode = 1;
  else if (result.summary.readiness === 'needs-spec-work') result.exitCode = 2;
  else result.exitCode = 0;

  result.nextCommand = formattedSourceIssues.length > 0 ? 'unslop scan --strict' : 'unslop audit --strict';
  result.suggestedPrompt = `Review the Unslop report. Resolve remaining blockers in ${formattedSourceIssues.length > 0 ? 'the source code' : 'the spec'} before implementation.`;

  return result;
}
