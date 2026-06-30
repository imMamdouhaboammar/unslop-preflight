import { writeText } from './filesystem.js';
import { loadStandardsPack } from './standardsPacks.js';


function buildEvidenceTable(evidences) {
  if (!evidences || !evidences.length) return 'No issues found.';
  
  const headers = '| Severity | Rule | Location | Symptom / Excerpt | Confidence |';
  const divider = '|----------|------|----------|-------------------|------------|';
  const rows = evidences.map(e => {
    const loc = e.file ? `${e.file}${e.line ? `:${e.line}` : ''}` : 'N/A';
    // Clean excerpt for markdown table
    const safeSymptom = (e.symptom || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    return `| ${e.severity.toUpperCase()} | \`${e.ruleName}\` | \`${loc}\` | ${safeSymptom} | ${e.confidence} |`;
  });
  
  return [headers, divider, ...rows].join('\n');
}

export function buildMarkdownReport(result, flags = {}) {
  const summary = result.summary || {};
  const evidences = result.evidences || [];
  
  const blockers = evidences.filter(e => e.severity === 'error' || e.severity === 'blocker');
  const topBlockers = blockers.slice(0, 5);

  let standardsLine = '';
  if (flags.standards) {
    try {
      const { manifest } = loadStandardsPack(flags.standards);
      standardsLine = `${manifest.name} (\`${flags.standards}\`)`;
    } catch (e) {
      standardsLine = `\`${flags.standards}\``;
    }
  }

  const lines = [
    '# Unslop Autopilot Report', 
    '', 
    '## 1. Executive Summary',
    `**Score:** ${summary.score}/100`, 
    `**Readiness:** ${summary.readiness || 'unknown'}`,
    summary.readinessMessage ? `> **Decision:** ${summary.readinessMessage}` : '',
    standardsLine ? `> **Enforced Standards:** ${standardsLine}` : '',
    '',
    `**Totals:** ${summary.errors} Blockers | ${summary.warnings} Warnings | ${summary.info} Info`, 
    ''
  ];

  if (topBlockers.length > 0) {
    lines.push('## 2. Top Blockers', '');
    for (const b of topBlockers) {
      lines.push(`- **[\`${b.ruleName}\`]** at \`${b.file || 'N/A'}\``);
      lines.push(`  - *Root Cause:* ${b.likelyRootCause || 'Unknown'}`);
      lines.push(`  - *Fix Strategy:* ${b.fixStrategy || 'Review and refactor'}`);
      lines.push(`  - *Verify:* ${b.verificationProof || 'N/A'}`);
    }
    lines.push('');
  }

  lines.push('## 3. Evidence Table', '', buildEvidenceTable(evidences), '');

  if (result.repairs?.length) { 
    lines.push('## 4. Auto Repairs Applied', ''); 
    for (const r of result.repairs) {
      lines.push(`- **${r.file}**: ${r.action}${r.rule ? ` (\`${r.rule}\`)` : ''}`);
    }
    lines.push('');
  }
  
  lines.push(
    '## 5. Agent Handoff Prompt', 
    '', 
    '> Inspect PRODUCT.md, DESIGN.md, AGENTS.md, package.json, routing files, component structure, and existing tests. Read `.unslop/fix-list.md` and resolve any listed issues. Implement only the requested scope while preserving existing behavior. Before completion, run `npx unslop audit`, ensure there are 0 errors, and show the final output score and readiness.',
    '',
    '## 6. Verification Checklist',
    '- [ ] Build succeeds without errors',
    '- [ ] Mobile viewports (320px, 375px, 390px) checked',
    '- [ ] Keyboard navigation and focus traps work',
    '- [ ] RTL layout checked (if applicable)',
    '- [ ] Overlays and modals render correctly without scroll cutoff'
  );
  
  return lines.join('\n');
}

export function buildFixList(result, flags = {}) {
  const evidences = result.evidences || [];
  // Skip info and docs fixes that were auto-applied
  const manualFixes = evidences.filter(e => e.severity !== 'info' && e.type !== 'spec');
  const summary = result.summary || {};

  let standardsLine = '';
  if (flags.standards) {
    try {
      const { manifest } = loadStandardsPack(flags.standards);
      standardsLine = `${manifest.name} (\`${flags.standards}\`)`;
    } catch (e) {
      standardsLine = `\`${flags.standards}\``;
    }
  }
  
  const lines = [
    'You are an expert AI frontend engineer.',
    'I have run `npx unslop` on our design documents and source code, and it has flagged the following issues that require human/agent intervention.',
    '',
    `Current readiness: ${summary.readiness || 'unknown'}`,
    summary.readinessMessage ? `Decision: ${summary.readinessMessage}` : '',
    standardsLine ? `Enforced Standards: ${standardsLine}` : '',
    '',
    'Please review PRODUCT.md, DESIGN.md, AGENTS.md, and the files listed below before implementing:',
    ''
  ];
  
  if (manualFixes.length === 0) {
    lines.push('No manual fixes required. The project is fully agent-ready!');
  } else {
    for (const e of manualFixes) {
      lines.push(`- [ ] **File**: \`${e.file || 'N/A'}\`${e.line ? ` (Line: ${e.line})` : ''}`);
      lines.push(`  - **Issue**: ${e.symptom || e.ruleName}`);
      if (e.likelyRootCause) lines.push(`  - **Root Cause**: ${e.likelyRootCause}`);
      if (e.fixStrategy) lines.push(`  - **Required Action**: ${e.fixStrategy}`);
      lines.push('');
    }
    lines.push('When you are done fixing these, run `npx unslop audit` and confirm the score reaches 100 with readiness `agent-ready`.');
  }
  
  return lines.join('\n');
}

export function writeReports(cwd, result, flags = {}) {
  const md = buildMarkdownReport(result, flags);
  const fixList = buildFixList(result, flags);
  
  writeText(cwd, '.unslop/report.md', md, flags);
  
  // Clean circular/complex objects before JSON stringify
  const safeResult = {
    ...result,
    standards: flags.standards || null,
    evidences: result.evidences?.map(e => e.toReportObject ? e.toReportObject() : e)
  };
  writeText(cwd, '.unslop/report.json', JSON.stringify(safeResult, null, 2), flags);
  writeText(cwd, '.unslop/fix-list.md', fixList, flags);
  
  return ['.unslop/report.md', '.unslop/report.json', '.unslop/fix-list.md'];
}
