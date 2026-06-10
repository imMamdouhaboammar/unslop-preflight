const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function formatText(text, colorFn, useColor) {
  if (!useColor) return text;
  return colorFn(text);
}

const c = {
  red: (t, u = true) => formatText(t, x => `${colors.red}${x}${colors.reset}`, u),
  green: (t, u = true) => formatText(t, x => `${colors.green}${x}${colors.reset}`, u),
  yellow: (t, u = true) => formatText(t, x => `${colors.yellow}${x}${colors.reset}`, u),
  blue: (t, u = true) => formatText(t, x => `${colors.blue}${x}${colors.reset}`, u),
  cyan: (t, u = true) => formatText(t, x => `${colors.cyan}${x}${colors.reset}`, u),
  bold: (t, u = true) => formatText(t, x => `${colors.bold}${x}${colors.reset}`, u),
};

export function parseArgs(argv) {
  const flags = {}; const args = [];
  for (const item of argv) {
    if (item.startsWith('--')) {
      const [key, raw] = item.slice(2).split('=');
      flags[key.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase())] = raw ?? true;
    } else {
      args.push(item);
    }
  }
  return { command: args[0], args: args.slice(1), flags, cwd: process.cwd() };
}

export function printHelp() {
  console.log(`
${c.bold(c.cyan('vibe-design-md-architect'))}

${c.bold('Usage:')}
  vibe-design-md-architect <command> [flags]

${c.bold('Commands:')}
  ${c.green('autopilot')}    Run init, audit, safe repair, and final report
  ${c.green('init')}         Create missing PRODUCT.md, DESIGN.md, and AGENT.md
  ${c.green('audit')}        Run quality gates against artifact docs
  ${c.green('repair')}       Append safe missing sections and checklists
  ${c.green('report')}       Write .vibe-design/report.md and report.json
  ${c.green('doctor')}       Check runtime and project assumptions

${c.bold('Flags:')}
  --dry-run      Preview writes without changing files
  --json         Print machine-readable JSON
  --agent-prompt Print a copyable prompt for AI agents
  --report       Write reports to .vibe-design
  --ci           Exit non-zero on errors
  --strict       Treat errors as failing
  --verbose      Show extra details
  --no-color     Disable color output
  --debug        Show stack traces
  --help         Show help
  --version      Show package version
`);
}

export function printResult(result, flags = {}) {
  const useColor = !flags.noColor;
  if (flags.json) return console.log(JSON.stringify(result, null, 2));
  
  if (flags.agentPrompt) {
    import('./report.js').then(m => {
      console.log(m.buildFixList(result));
    });
    return;
  }
  
  const s = result.summary || { score: 0, checks: 0, errors: 0, warnings: 0, info: 0 };
  
  console.log(`\n${c.bold(c.cyan('Vibe Design MD Architect Output', useColor), useColor)}`);
  
  const scoreColor = s.score >= 90 ? c.green : s.score >= 70 ? c.yellow : c.red;
  console.log(`Score: ${scoreColor(s.score.toString(), useColor)}/100 | Checks: ${s.checks} | Errors: ${c.red(s.errors.toString(), useColor)} | Warnings: ${c.yellow(s.warnings.toString(), useColor)} | Info: ${s.info}`);
  
  if (result.generated?.length) console.log(`${c.green('Generated:', useColor)} ${result.generated.join(', ')}`);
  if (result.changed?.length) console.log(`${c.blue('Changed:', useColor)} ${result.changed.join(', ')}`);
  if (result.repairs?.length) console.log(`${c.yellow('Auto-repaired:', useColor)} ${result.repairs.length} items`);
  
  if (result.issues?.length) {
    console.log(`\n${c.bold('Issues:', useColor)}`);
    for (const issue of result.issues) {
      const isError = issue.severity === 'error';
      const sevColor = isError ? c.red : issue.severity === 'warning' ? c.yellow : c.cyan;
      const marker = isError ? '✕' : (issue.severity === 'warning' ? '⚠' : 'ℹ');
      console.log(`  ${sevColor(`${marker} [${issue.severity.toUpperCase()}]`, useColor)} ${issue.id}: ${issue.title}`);
      if (flags.verbose && issue.suggestedFix) {
        console.log(`      ↳ ${c.blue('Fix:', useColor)} ${issue.suggestedFix}`);
      }
    }
  } else if (!flags.json) {
    console.log(`\n${c.green('✓ No issues found! Your design spec is robust.', useColor)}`);
  }
  
  if (result.nextCommand) {
    console.log(`\n${c.bold('Next steps:', useColor)}`);
    console.log(`  Run: ${c.cyan(result.nextCommand, useColor)}`);
  }
  
  if (result.suggestedPrompt) {
    console.log(`\n${c.bold('Suggested Prompt for AI Coding Agent:', useColor)}`);
    console.log(`> ${result.suggestedPrompt}`);
  }
}

