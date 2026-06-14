import { readText } from './filesystem.js';
import { rules } from '../rules/index.js';
import { calculateScore, readinessBand, readinessMessage } from './scoring.js';
import { convertLegacyIssueToEvidence } from './findings.js';

export function loadContext(cwd) {
  const files = {
    'PRODUCT.md': readText(cwd, 'PRODUCT.md'),
    'DESIGN.md': readText(cwd, 'DESIGN.md'),
    'AGENTS.md': readText(cwd, 'AGENTS.md'),
    'AGENT.md': readText(cwd, 'AGENT.md')
  };

  const agentInstructionFile = files['AGENTS.md'] ? 'AGENTS.md' : (files['AGENT.md'] ? 'AGENT.md' : null);
  const agentInstructions = agentInstructionFile ? files[agentInstructionFile] : '';
  const all = Object.values(files).filter(Boolean).join('\n\n');

  return { cwd, files, all, agentInstructionFile, agentInstructions };
}

export function runAudit(cwd) {
  const ctx = loadContext(cwd);
  const issues = rules.filter((r) => r.test(ctx)).map(({ test, ...rest }) => rest);
  return summarize({ issues, generated: [], changed: [], repairs: [] });
}

function categorySummary(issues) {
  return issues.reduce((acc, issue) => {
    const key = issue.category || 'uncategorized';
    acc[key] ||= { errors: 0, warnings: 0, info: 0, total: 0 };
    acc[key].total += 1;
    if (issue.severity === 'error' || issue.severity === 'blocker') acc[key].errors += 1;
    else if (issue.severity === 'warning') acc[key].warnings += 1;
    else acc[key].info += 1;
    return acc;
  }, {});
}

export function summarize(result) {
  // Convert all incoming issues to Evidence objects for the new scoring engine
  const evidences = result.issues.map(i => {
    if (i.constructor.name === 'Evidence') return i;
    return convertLegacyIssueToEvidence(i, i.type || 'spec');
  });

  const errors = evidences.filter((i) => i.severity === 'error' || i.severity === 'blocker').length;
  const warnings = evidences.filter((i) => i.severity === 'warning').length;
  const info = evidences.filter((i) => i.severity === 'info').length;

  const score = calculateScore(evidences);
  const band = readinessBand(score, errors, warnings);
  
  return {
    ...result,
    evidences, // Attach the full Evidence objects
    summary: {
      score,
      checks: rules.length, // Does not include source scanners count dynamically yet
      errors,
      warnings,
      info,
      readiness: band,
      readinessMessage: readinessMessage(band),
      categories: categorySummary(result.issues)
    }
  };
}
