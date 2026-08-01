import { POLISH_RULES } from '../rules/interfaceFeelRules.js';

export function scanInterfaceFeel(content, filepath = '') {
  if (!content || typeof content !== 'string') {
    return { findings: [] };
  }

  const lines = content.split('\n');
  const findings = [];

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1;
    for (const rule of POLISH_RULES) {
      if (rule.regex.test(line)) {
        findings.push({
          ruleId: rule.id,
          severity: rule.severity,
          line: lineNumber,
          message: rule.message,
          filepath,
          fix: 'Apply design engineering polish principle.'
        });
      }
    }
  });

  return { findings };
}
