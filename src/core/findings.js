export class Evidence {
  constructor({
    ruleName,
    symptom,
    likelyRootCause,
    evidenceSnippet,
    file,
    line,
    fixStrategy,
    verificationProof,
    confidence = 'medium', // high, medium, low
    impact = 'visual break', // visual break, accessibility break, implementation ambiguity, agent-risk, security/privacy
    severity = 'warning', // blocker, warning, info
    effort = 'small', // small, medium, large
    type = 'code' // spec, code, harness
  }) {
    this.ruleName = ruleName;
    this.symptom = symptom;
    this.likelyRootCause = likelyRootCause;
    this.evidenceSnippet = evidenceSnippet;
    this.file = file;
    this.line = line;
    this.fixStrategy = fixStrategy;
    this.verificationProof = verificationProof;
    this.confidence = confidence;
    this.impact = impact;
    this.severity = severity;
    this.effort = effort;
    this.type = type;
  }

  toReportObject() {
    return {
      rule: this.ruleName,
      symptom: this.symptom,
      rootCause: this.likelyRootCause,
      location: this.file ? `${this.file}${this.line ? `:${this.line}` : ''}` : 'N/A',
      evidence: this.evidenceSnippet,
      fix: this.fixStrategy,
      verify: this.verificationProof,
      confidence: this.confidence,
      impact: this.impact,
      severity: this.severity,
      type: this.type
    };
  }
}

// Helper to convert legacy issues from audit to Evidence objects
export function convertLegacyIssueToEvidence(issue, type = 'spec') {
  return new Evidence({
    ruleName: issue.id || issue.rule,
    symptom: issue.description || issue.excerpt,
    likelyRootCause: 'Design or spec omission',
    evidenceSnippet: issue.excerpt || issue.description,
    file: issue.file,
    line: issue.line,
    fixStrategy: 'Update the relevant Markdown spec file.',
    verificationProof: 'Re-run audit --strict',
    confidence: 'high',
    impact: 'implementation ambiguity',
    severity: issue.severity || issue.level || 'warning',
    effort: 'small',
    type
  });
}
