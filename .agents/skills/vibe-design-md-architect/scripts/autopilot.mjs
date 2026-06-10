#!/usr/bin/env node
/**
 * autopilot.mjs - VDMA Agentic Autopilot
 *
 * One command that runs every gate in sequence, auto-repairs failures,
 * re-runs until all gates pass, and outputs VDMA-FIXES.md for source issues.
 */

import { existsSync, writeFileSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(__dirname, '..');
const CWD = process.cwd();

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m', white: '\x1b[37m',
};

const args = process.argv.slice(2);
const opt = (name, def) => {
  const found = args.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : def;
};
const flag = (name) => args.includes(`--${name}`);

const MAX_PASSES = parseInt(opt('max-passes', '3'), 10);
const NO_SOURCE = flag('no-source-scan');
const NO_IMPECCABLE = flag('no-impeccable');
const DRY_RUN = flag('dry-run');

const DESIGN_PATH = resolve(CWD, opt('design', 'DESIGN.md'));
const PRODUCT_PATH = resolve(CWD, opt('product', 'PRODUCT.md'));
const INTAKE_PATH = resolve(CWD, 'INTAKE.session.md');
const STANDARDS_PATH = resolve(CWD, 'STANDARDS.search-notes.md');
const SRC_PATH = opt('src', ['src', 'app', 'pages', 'components'].find(d => existsSync(join(CWD, d))) || 'src');

const state = {
  totalRepairs: 0,
  sourceFixes: [],
  startTime: Date.now(),
};

function header() {
  const width = 60;
  const line = '━'.repeat(width);
  console.log(`\n${c.bold}${c.magenta}${line}`);
  console.log(`  VDMA Autopilot${c.reset}${c.magenta}  ◆  ${c.cyan}One command. All gates. Auto-repair.${c.magenta}`);
  console.log(`  ${DRY_RUN ? c.yellow + 'DRY-RUN MODE' + c.reset + c.magenta : ''}Scanning: ${relative(CWD, DESIGN_PATH) || 'DESIGN.md'}`);
  console.log(`${line}${c.reset}\n`);
}

function passHeader(n, total) {
  console.log(`\n${c.bold}${c.blue}  ◆ Pass ${n} of ${total}${c.reset}  ${c.dim}(auto-repair loop)${c.reset}\n`);
}

function phaseStart(n, total, label) {
  process.stdout.write(`  ${c.dim}[${String(n).padStart(2)}/${total}]${c.reset}  ${label.padEnd(38)} `);
}

function phasePass(note = '') { console.log(`${c.green}✓${c.reset}${note ? '  ' + c.dim + note + c.reset : ''}`); }
function phaseFail(note = '') { console.log(`${c.yellow}↻${c.reset}  ${c.yellow}repairing${c.reset}${note ? ' - ' + note : ''}`); }
function phaseError(note = '') { console.log(`${c.red}✗${c.reset}  ${note}`); }
function phaseSkip(note = '') { console.log(`${c.dim}-${c.reset}  ${c.dim}${note}${c.reset}`); }
function repairLine(label) { console.log(`           ${c.cyan}↳${c.reset} ${label}`); }

function footer(allPassed) {
  const elapsed = ((Date.now() - state.startTime) / 1000).toFixed(1);
  const width = 60;
  console.log(`\n${c.bold}${c.magenta}${'━'.repeat(width)}${c.reset}`);
  if (DRY_RUN) {
    console.log(`  ${c.bold}${c.yellow}✓ Dry-run complete${c.reset}  ${c.dim}${elapsed}s${c.reset}`);
  } else if (allPassed) {
    console.log(`  ${c.bold}${c.green}✓ Autopilot complete${c.reset}  ${c.dim}${elapsed}s - ${state.totalRepairs} auto-repair(s) applied${c.reset}`);
  } else {
    console.log(`  ${c.bold}${c.yellow}⚠ Autopilot finished${c.reset}  ${c.dim}${elapsed}s - some issues need manual fixes${c.reset}`);
  }
  if (existsSync(DESIGN_PATH)) console.log(`  ${c.dim}DESIGN.md ${c.reset}${c.green}✓ ready${c.reset}`);
  if (existsSync(PRODUCT_PATH)) console.log(`  ${c.dim}PRODUCT.md${c.reset}${c.green}✓ ready${c.reset}`);
  if (state.sourceFixes.length > 0) {
    console.log(`\n  ${c.yellow}⚠ ${state.sourceFixes.length} source issue(s) require agent/human fix${c.reset}`);
    console.log(`  ${c.dim}→ see VDMA-FIXES.md${c.reset}`);
  }
  if (allPassed && state.sourceFixes.length === 0 && !DRY_RUN) {
    console.log(`\n  ${c.bold}${c.green}Implementation unblocked. You may now write UI code.${c.reset}`);
    console.log(`  ${c.dim}Run ${c.reset}${c.cyan}npx impeccable shape${c.reset}${c.dim} to start building.${c.reset}`);
  }
  console.log(`${c.bold}${c.magenta}${'━'.repeat(width)}${c.reset}\n`);
}

function runScript(script, scriptArgs = []) {
  const scriptPath = join(SKILL_ROOT, 'scripts', script);
  if (!existsSync(scriptPath)) return { status: 1, stdout: '', stderr: `Script not found: ${script}`, notFound: true, output: `Script not found: ${script}` };
  const result = spawnSync('node', [scriptPath, ...scriptArgs], {
    cwd: CWD,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '1', NO_COLOR: undefined },
    timeout: 60_000,
  });
  return {
    status: result.status ?? 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    output: (result.stdout || '') + (result.stderr || ''),
  };
}

function runNpx(pkg, pkgArgs = []) {
  const result = spawnSync('npx', ['-y', pkg, ...pkgArgs], {
    cwd: CWD,
    encoding: 'utf8',
    shell: true,
    env: { ...process.env, npm_config_yes: 'true' },
    timeout: 60_000,
  });
  return { status: result.status ?? 0, stdout: result.stdout || '', stderr: result.stderr || '' };
}

function parseRepairOutput(output) {
  const match = output.match(/VDMA_REPAIR_JSON:(\{.+\})/);
  if (!match) return { repairs: [], warnings: [] };
  try { return JSON.parse(match[1]); } catch { return { repairs: [], warnings: [] }; }
}

function parseBlockers(output) {
  const blockers = [];
  for (const line of output.split('\n')) {
    const m = line.match(/\[BLOCKER\](.+)/i) || line.match(/blocker[:\s]+(.+)/i) || line.match(/✗ BLOCKER[:\s]+(.+)/i);
    if (m) blockers.push(m[1].trim());
  }
  return blockers;
}

function writeFixesFile(fixes) {
  if (fixes.length === 0) return;
  const uniqueFixes = [...new Set(fixes)];
  const content = `# VDMA-FIXES.md\n\n> Generated by \`npx vdma autopilot\` on ${new Date().toISOString().slice(0, 10)}\n\nThese issues were found in your source code and require a coding agent or developer to fix.\n\nTo apply all fixes, tell your AI coding agent:\n\n\`\`\`\nApply all fixes listed in VDMA-FIXES.md, then run: npx vdma autopilot\n\`\`\`\n\n## Source code issues (${uniqueFixes.length} item${uniqueFixes.length === 1 ? '' : 's'})\n\n${uniqueFixes.map((f, i) => `### Fix ${i + 1}\n\n${f}\n`).join('\n')}\n\nAfter applying fixes, run:\n\n\`\`\`bash\nnpx vdma autopilot\n\`\`\`\n`;
  writeFileSync(join(CWD, 'VDMA-FIXES.md'), content);
}

function extractGateFailures(output) {
  const failures = [];
  for (const line of output.split('\n')) {
    const m = line.match(/FAIL[ED]?:?\s+Gate\s+\d+[:\s]+(.+)/i)
      || line.match(/\[FAIL\]\s+(.+)/i)
      || line.match(/✗\s+Gate\s+\d+[:\s]+(.+)/i)
      || line.match(/missing[:\s]+(.+)/i);
    if (m) failures.push(m[1].trim().slice(0, 80));
  }
  return [...new Set(failures)].slice(0, 8);
}

async function runAutopilot() {
  header();
  
  if (!NO_IMPECCABLE) {
    process.stdout.write(`  ${c.dim}[setup]${c.reset}  Impeccable setup gate                 `);
    if (DRY_RUN) phaseSkip('dry-run');
    else {
      const r = runNpx('impeccable', ['skills', 'install']);
      if (r.status === 0) phasePass();
      else {
        phaseFail('unavailable, continuing manually');
        repairLine('DESIGN.md will still include the setup command');
      }
    }
  }

  const TOTAL_PHASES = NO_SOURCE ? 6 : 8;
  let finalGatesPassed = false;

  for (let pass = 1; pass <= MAX_PASSES; pass++) {
    passHeader(pass, MAX_PASSES);
    let phaseNum = 0;
    const P = () => ++phaseNum;
    let passHadRepairs = false;
    let gatesAllPassed = false;

    phaseStart(P(), TOTAL_PHASES, 'Bootstrap + repair artifacts');
    if (DRY_RUN) phaseSkip('dry-run');
    else {
      const r = runScript('repair-design-md.mjs', [DESIGN_PATH, PRODUCT_PATH]);
      if (r.status !== 0) {
        phaseError('repair engine failed to run');
      } else {
        const { repairs } = parseRepairOutput(r.output);
        if (repairs.length === 0) phasePass('no repairs needed');
        else {
          phaseFail(`${repairs.length} repair(s)`);
          for (const rep of repairs) repairLine(rep.label);
          state.totalRepairs += repairs.length;
          passHadRepairs = true;
        }
      }
    }

    phaseStart(P(), TOTAL_PHASES, 'Intake session');
    if (DRY_RUN) phaseSkip('dry-run');
    else {
      const existed = existsSync(INTAKE_PATH);
      const r = runScript('intake-session.mjs', [INTAKE_PATH]);
      if (r.status === 0) phasePass(existed ? 'exists' : 'created');
      else phaseError(r.stderr || r.stdout || 'failed');
    }

    phaseStart(P(), TOTAL_PHASES, 'Standards search brief');
    if (DRY_RUN) phaseSkip('dry-run');
    else {
      const existed = existsSync(STANDARDS_PATH);
      const r = runScript('standards-search-brief.mjs', [PRODUCT_PATH, DESIGN_PATH]);
      if (r.status === 0) phasePass(existed ? 'exists' : 'scaffolded');
      else phaseError(r.stderr || r.stdout || 'failed');
    }

    phaseStart(P(), TOTAL_PHASES, 'Validate DESIGN.md');
    if (DRY_RUN) phaseSkip('dry-run');
    else if (!existsSync(DESIGN_PATH)) phaseError('DESIGN.md not found');
    else {
      const r = runScript('validate-design-md.mjs', [DESIGN_PATH]);
      if (r.status === 0) phasePass();
      else {
        phaseFail('running repair');
        const r2 = runScript('repair-design-md.mjs', [DESIGN_PATH, PRODUCT_PATH]);
        if (r2.status !== 0) {
          phaseError('repair engine failed to run');
        } else {
          const { repairs } = parseRepairOutput(r2.output);
          for (const rep of repairs) repairLine(rep.label);
          state.totalRepairs += repairs.length;
          if (repairs.length > 0) passHadRepairs = true;
          const r3 = runScript('validate-design-md.mjs', [DESIGN_PATH]);
          if (r3.status === 0) repairLine('validation now passes');
        }
      }
    }

    phaseStart(P(), TOTAL_PHASES, 'Score DESIGN.md');
    if (DRY_RUN) phaseSkip('dry-run');
    else if (!existsSync(DESIGN_PATH)) phaseSkip('DESIGN.md not ready');
    else {
      const r = runScript('score-design-md.mjs', [DESIGN_PATH, PRODUCT_PATH]);
      const scoreMatch = r.output.match(/score[:\s]+(\d+)/i) || r.output.match(/(\d+)\s*\/\s*100/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
      if (r.status === 0) phasePass(score !== null ? `score: ${score}/100` : '');
      else {
        phaseFail(score !== null ? `score: ${score}/100, improving` : 'below threshold, improving');
        const r2 = runScript('repair-design-md.mjs', [DESIGN_PATH, PRODUCT_PATH]);
        if (r2.status !== 0) {
          phaseError('repair engine failed to run');
        } else {
          const { repairs } = parseRepairOutput(r2.output);
          for (const rep of repairs) repairLine(rep.label);
          state.totalRepairs += repairs.length;
          if (repairs.length > 0) passHadRepairs = true;
        }
      }
    }

    phaseStart(P(), TOTAL_PHASES, 'Run 23 gates (DESIGN.md)');
    if (DRY_RUN) phaseSkip('dry-run');
    else if (!existsSync(DESIGN_PATH)) phaseSkip('DESIGN.md not ready');
    else {
      const gateArgs = [DESIGN_PATH, existsSync(PRODUCT_PATH) ? PRODUCT_PATH : '', existsSync(join(CWD, SRC_PATH)) ? SRC_PATH : ''].filter(Boolean);
      const r = runScript('run-gates.mjs', gateArgs);
      if (r.status === 0) {
        phasePass('all gates pass');
        gatesAllPassed = true;
      } else {
        const gateFailures = extractGateFailures(r.output);
        phaseFail(`${gateFailures.length || 'some'} gate(s) failed`);
        for (const gf of gateFailures) repairLine(gf);
        const r2 = runScript('repair-design-md.mjs', [DESIGN_PATH, PRODUCT_PATH]);
        if (r2.status !== 0) {
          phaseError('repair engine failed to run');
        } else {
          const { repairs } = parseRepairOutput(r2.output);
          for (const rep of repairs) repairLine(rep.label);
          state.totalRepairs += repairs.length;
          if (repairs.length > 0) passHadRepairs = true;
          const r3 = runScript('run-gates.mjs', gateArgs);
          if (r3.status === 0) {
            repairLine('all gates now pass');
            gatesAllPassed = true;
          }
        }
      }
    }

    if (!NO_SOURCE) {
      phaseStart(P(), TOTAL_PHASES, 'Scan UI implementation');
      const srcFull = join(CWD, SRC_PATH);
      if (!existsSync(srcFull)) phaseSkip(`${SRC_PATH}/ not found`);
      else if (DRY_RUN) phaseSkip('dry-run');
      else {
        const r = runScript('scan-ui-implementation.mjs', [srcFull]);
        if (r.status === 0) phasePass('0 blockers');
        else {
          const blockers = parseBlockers(r.output);
          phaseError(`${blockers.length} blocker(s), see VDMA-FIXES.md`);
          state.sourceFixes.push(...blockers.map(b => `**UI Scanner blocker:** ${b}`));
        }
      }
    }

    if (!NO_SOURCE) {
      phaseStart(P(), TOTAL_PHASES, 'Scan accessibility (WCAG 2.2)');
      const srcFull = join(CWD, SRC_PATH);
      if (!existsSync(srcFull)) phaseSkip(`${SRC_PATH}/ not found`);
      else if (DRY_RUN) phaseSkip('dry-run');
      else {
        const r = runScript('scan-accessibility.mjs', [srcFull]);
        if (r.status === 0) phasePass('0 blockers');
        else {
          const blockers = parseBlockers(r.output);
          phaseError(`${blockers.length} a11y blocker(s), see VDMA-FIXES.md`);
          state.sourceFixes.push(...blockers.map(b => `**Accessibility blocker (WCAG 2.2):** ${b}`));
        }
      }
    }

    finalGatesPassed = gatesAllPassed;
    
    // Deduplicate before writing
    state.sourceFixes = [...new Set(state.sourceFixes)];
    writeFixesFile(state.sourceFixes);

    if (!passHadRepairs) break;
    if (pass < MAX_PASSES) console.log(`\n  ${c.dim}Repairs applied. Re-running gates...${c.reset}`);
  }

  const allPassed = DRY_RUN ? true : (finalGatesPassed && state.sourceFixes.length === 0);
  footer(allPassed);
  process.exit(allPassed ? 0 : state.sourceFixes.length > 0 ? 2 : 1);
}

runAutopilot().catch(e => {
  console.error(`\n${c.red}Autopilot error:${c.reset} ${e.message}`);
  process.exit(1);
});
