import { runAudit } from '../core/auditor.js';
import { printResult } from '../core/output.js';
import { fingerprintProject } from '../core/projectFingerprint.js';
import { runSourceScanners } from '../core/sourceScanner.js';

function toIssue(finding) {
  const severity = finding.level === 'blocker' ? 'error' : finding.level || 'warning';
  return {
    id: finding.rule,
    title: finding.excerpt || finding.rule,
    category: `source-${finding.type || 'scan'}`,
    severity,
    file: finding.file,
    line: finding.line,
    excerpt: finding.excerpt,
    suggestedFix: 'Fix the source-level issue, then rerun `npx unslop-preflight scan` or `npx unslop-preflight autopilot`.',
    repairability: 'manual',
    type: 'code'
  };
}

export async function audit({ cwd, flags }) {
  const auditResult = runAudit(cwd);
  let issues = [...auditResult.issues];
  let scanStats = null;
  let scannerResults = null;

  if (flags?.standards) {
    const fingerprint = fingerprintProject(cwd);
    const sourceFindings = runSourceScanners(cwd, fingerprint, flags);
    const mapped = sourceFindings.map(toIssue);
    issues.push(...mapped);
    scanStats = sourceFindings.metadata?.scanStats;
    scannerResults = sourceFindings.metadata?.scannerResults;
  }

  const { summarize } = await import('../core/auditor.js');
  const result = {
    ...summarize({
      issues,
      generated: auditResult.generated || [],
      changed: auditResult.changed || [],
      repairs: auditResult.repairs || [],
      ...(flags?.standards ? { selectedStandards: flags.standards } : {})
    }),
    ...(scanStats ? { scanStats } : {}),
    ...(scannerResults ? { scannerResults } : {}),
    nextCommand: 'npx unslop-preflight repair --report'
  };

  printResult(result, flags);
  return result;
}
