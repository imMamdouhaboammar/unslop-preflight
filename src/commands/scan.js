import { fingerprintProject } from '../core/projectFingerprint.js';
import { emptySourceScanMetadata, runSourceScanners } from '../core/sourceScanner.js';
import { summarize } from '../core/auditor.js';
import { Evidence } from '../core/findings.js';
import { printResult } from '../core/output.js';

function scannerFailureEvidence(failure, strict = false) {
  return new Evidence({
    ruleName: `scanner-failed:${failure.scanner}`,
    symptom: `${failure.scanner} scanner failed for ${failure.targetDir}`,
    likelyRootCause: 'A source scanner crashed or could not read the target path.',
    evidenceSnippet: failure.error || 'Scanner failed without details.',
    file: failure.targetDir,
    fixStrategy: 'Fix the scanner input path or scanner failure, then rerun `unslop scan`.',
    verificationProof: 'Rerun `unslop scan --strict` and confirm scannerFailures is 0.',
    confidence: 'high',
    impact: 'agent-risk',
    severity: strict ? 'error' : 'warning',
    effort: 'small',
    type: 'scanner'
  });
}

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

  const sourceFindings = flags.noSourceScan
    ? []
    : runSourceScanners(cwd, fingerprint);

  const metadata = sourceFindings.metadata || emptySourceScanMetadata();
  const scannerFailures = (metadata.scannerResults || [])
    .filter((result) => result.status === 'failed')
    .map((failure) => scannerFailureEvidence(failure, Boolean(flags.strict)));

  const issues = [
    ...sourceFindings.map(toIssue),
    ...scannerFailures
  ];

  const result = summarize({
    issues,
    generated: [],
    changed: [],
    repairs: [],
    fingerprint,
    scannerFindings: sourceFindings,
    scannerResults: metadata.scannerResults,
    scanStats: metadata.scanStats,
    nextCommand: 'unslop autopilot --report'
  });

  if (flags.strict && metadata.scanStats.scannerFailures > 0) {
    result.exitCode = 1;
  }

  printResult(result, flags);
  return result;
}
