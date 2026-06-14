import { HARNESS_CATALOG } from './harnessCatalog.js';
import { Evidence } from './findings.js';

export function adviseHarnesses(fingerprint) {
  const recommendations = [];

  for (const [key, harness] of Object.entries(HARNESS_CATALOG)) {
    if (harness.trigger(fingerprint)) {
      recommendations.push(new Evidence({
        ruleName: `missing-skill-${harness.id}`,
        symptom: harness.symptom,
        likelyRootCause: 'AI Agent context limitation',
        evidenceSnippet: `Project framework: ${fingerprint.framework}`,
        fixStrategy: harness.fixStrategy,
        verificationProof: `Agent acknowledges and utilizes the ${harness.id} skill`,
        confidence: 'high',
        impact: 'agent-risk',
        severity: 'info', // Usually harness recommendations are just info/warnings
        effort: 'small',
        type: 'harness'
      }));
    }
  }

  return recommendations;
}
