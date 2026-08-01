import { BANNED_WORDS, PROSE_PATTERNS } from '../rules/proseSlopRules.js';

export function scanProse(text) {
  if (!text || typeof text !== 'string') {
    return { findings: [] };
  }

  const lines = text.split('\n');
  const findings = [];

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1;

    // Banned words check
    for (const word of BANNED_WORDS) {
      const regex = new RegExp(`\\b${word.replace('-', '\\-')}\\b`, 'gi');
      if (regex.test(line)) {
        findings.push({
          ruleId: `banned-word-${word.toLowerCase().replace(/\s+/g, '-')}`,
          severity: 'HIGH',
          line: lineNumber,
          message: `Banned AI-slop word "${word}" found.`,
          match: word,
          fix: `Remove or replace "${word}" with a direct, concrete term.`
        });
      }
    }

    // Pattern checks
    for (const pat of PROSE_PATTERNS) {
      if (pat.regex.test(line)) {
        findings.push({
          ruleId: pat.id,
          severity: 'MEDIUM',
          line: lineNumber,
          message: pat.message,
          match: line.trim(),
          fix: 'Rephrase sentence according to no-ai-slop guidelines.'
        });
      }
    }
  });

  return { findings };
}
