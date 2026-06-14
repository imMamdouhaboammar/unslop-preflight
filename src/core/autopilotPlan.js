import { fingerprintProject } from './projectFingerprint.js';
import { runSourceScanners } from './sourceScanner.js';
import { runAudit, summarize } from './auditor.js';
import { applyRepairs } from './repair.js';
import { writeReports } from './report.js';
import { printResult } from './output.js';
import { convertLegacyIssueToEvidence, Evidence } from './findings.js';
import { planRepairs } from './repairPlanner.js';
import { adviseHarnesses } from './harnessAdvisor.js';

export function runAutopilotPipeline(cwd, flags = {}) {
  // 1. Project fingerprint
  const fingerprint = fingerprintProject(cwd);

  // 2. Spec audit (first pass)
  const firstAudit = runAudit(cwd);

  // 3. Source scan
  const sourceIssues = runSourceScanners(cwd, fingerprint);
  
  // Format source issues into Evidence objects
  const formattedSourceIssues = sourceIssues.map(f => new Evidence({
    ruleName: f.rule,
    symptom: f.excerpt,
    likelyRootCause: 'Code implementation error or omission',
    evidenceSnippet: f.excerpt,
    file: f.file,
    line: f.line,
    fixStrategy: 'See scanner specific fix guidelines.',
    confidence: 'high',
    impact: 'visual break', // Or mapped from f.level
    severity: f.level === 'blocker' ? 'error' : 'warning',
    effort: 'small',
    type: 'modular'
  }));

  // 3.5. Harness recommendations
  const harnessRecommendations = adviseHarnesses(fingerprint);

  const allInitialEvidences = [
    ...firstAudit.issues.map(i => convertLegacyIssueToEvidence(i, i.type || 'spec')),
    ...formattedSourceIssues,
    ...harnessRecommendations
  ];

  // 4. Safe repairs (Tier 1 & 2 via Repair Planner)
  const repairPlan = planRepairs(allInitialEvidences);
  const patch = applyRepairs(cwd, repairPlan, flags);

  // 5. Second audit (post-repair)
  const finalAudit = runAudit(cwd);
  
  // We must re-scan source, or assume source issues are NOT auto-repaired by docs
  // Since docs repair doesn't fix UI code, we retain the source issues.
  const finalIssues = [...finalAudit.issues, ...formattedSourceIssues, ...harnessRecommendations];

  // 6. Diagnosis & Verification plan (Summarize)
  const result = summarize({ ...finalAudit, issues: finalIssues, ...patch, fingerprint });

  // 7. Final report
  result.reportFiles = writeReports(cwd, result, flags);
  
  // Exit codes for CI
  const errors = result.issues.filter(i => i.severity === 'error' || i.severity === 'blocker').length;
  if (errors > 0) result.exitCode = 1; // Blocked errors
  else if (result.summary.readiness === 'needs-spec-work') result.exitCode = 2;
  else if (formattedSourceIssues.some(i => i.severity === 'error')) result.exitCode = 4;
  else result.exitCode = 0;

  result.nextCommand = 'unslop audit --strict';
  result.suggestedPrompt = `Review the VDMA report. Resolve any remaining blockers in ${formattedSourceIssues.length > 0 ? 'the source code' : 'the spec'}. Apply the fix-list instructions before proceeding.`;

  return result;
}
