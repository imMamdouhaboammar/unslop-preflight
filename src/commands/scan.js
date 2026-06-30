import { fingerprintProject } from '../core/projectFingerprint.js';
import { runSourceScanners } from '../core/sourceScanner.js';
import { summarize } from '../core/auditor.js';
import { printResult } from '../core/output.js';

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
    suggestedFix: 'Fix the source-level issue, then rerun `unslop scan` or `unslop autopilot`.',
    repairability: 'manual',
    type: 'code'
  };
}

export async function scan({ cwd, args, flags }) {
  const fingerprint = fingerprintProject(cwd);
  const target = args?.[0];

  if (target) {
    fingerprint.srcDirs = [target.replace(/^\.\//, '')];
  }

  const findings = flags.noSourceScan ? [] : runSourceScanners(cwd, fingerprint, flags);
  const issues = findings.map(toIssue);
  const result = summarize({
    issues,
    generated: [],
    changed: [],
    repairs: [],
    fingerprint,
    scannerFindings: findings,
    nextCommand: 'unslop autopilot --report'
  });

  printResult(result, flags);
  return result;
}
