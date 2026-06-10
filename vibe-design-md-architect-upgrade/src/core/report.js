import { writeText } from './filesystem.js';

export function buildMarkdownReport(result) {
  const lines = [
    '# Vibe Design MD Architect Report', 
    '', 
    `Score: **${result.summary.score}/100**`, 
    `Checks: ${result.summary.checks} | Errors: ${result.summary.errors} | Warnings: ${result.summary.warnings} | Info: ${result.summary.info}`, 
    ''
  ];
  
  if (result.issues.length) { 
    lines.push('## Issues'); 
    for (const i of result.issues) {
      lines.push(`- **[${i.severity.toUpperCase()}]** ${i.title}`);
      lines.push(`  - *Rule:* \`${i.id}\``);
      if (i.suggestedFix) lines.push(`  - *Fix:* ${i.suggestedFix}`);
    }
  }
  
  if (result.repairs?.length) { 
    lines.push('', '## Auto Repairs Applied'); 
    for (const r of result.repairs) {
      lines.push(`- **${r.file}**: ${r.action}${r.rule ? ` (\`${r.rule}\`)` : ''}`);
    }
  }
  
  lines.push(
    '', 
    '## Suggested Next Agent Prompt', 
    '', 
    '> Inspect PRODUCT.md, DESIGN.md, and AGENT.md. Read `.vibe-design/fix-list.md` and resolve any listed issues. Implement the requested scope while preserving existing behavior. **MANDATORY**: Before you complete this task, you MUST run `npx vibe-design-md-architect audit` in the terminal, ensure there are 0 errors, and show me the final output score.'
  );
  
  return lines.join('\n');
}

export function buildFixList(result) {
  const manualFixes = result.issues.filter(i => i.repairability !== 'auto' && !i.id.endsWith('-missing'));
  
  const lines = [
    'You are an expert AI frontend engineer.',
    'I have run `npx vibe-design-md-architect` on our design documents, and it has flagged the following issues that require human/agent intervention.',
    '',
    'Please review the files and implement the suggested fixes:',
    ''
  ];
  
  if (manualFixes.length === 0) {
    lines.push('No manual fixes required. The design specs look solid!');
  } else {
    for (const i of manualFixes) {
      lines.push(`- [ ] **File**: \`${i.file}\``);
      lines.push(`  - **Issue**: ${i.title}`);
      if (i.suggestedFix) lines.push(`  - **Required Action**: ${i.suggestedFix}`);
      lines.push('');
    }
    lines.push('When you are done fixing these, run `npx vibe-design-md-architect audit` and confirm the score reaches 100.');
  }
  
  return lines.join('\n');
}

export function writeReports(cwd, result, flags = {}) {
  const md = buildMarkdownReport(result);
  const fixList = buildFixList(result);
  
  writeText(cwd, '.vibe-design/report.md', md, flags);
  writeText(cwd, '.vibe-design/report.json', JSON.stringify(result, null, 2), flags);
  writeText(cwd, '.vibe-design/fix-list.md', fixList, flags);
  
  return ['.vibe-design/report.md', '.vibe-design/report.json', '.vibe-design/fix-list.md'];
}
