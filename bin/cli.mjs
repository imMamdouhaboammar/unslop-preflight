#!/usr/bin/env node
/**
 * vibe-design-md-architect CLI
 * Autopilot design quality gates for AI-assisted UI development.
 *
 * Usage:
 *   npx vibe-design-md-architect [command] [options]
 *
 * https://github.com/imMamdouhaboammar/vibe-design-md-architect
 */

import { readFileSync, existsSync, mkdirSync, cpSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(__dirname, '..');
const PKG = JSON.parse(readFileSync(join(SKILL_ROOT, 'package.json'), 'utf8'));
const VERSION = PKG.version;

const c = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  red:     '\x1b[31m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
};
const ok  = (s) => `${c.green}✓${c.reset} ${s}`;
const err = (s) => `${c.red}✗${c.reset} ${s}`;
const inf = (s) => `${c.cyan}→${c.reset} ${s}`;
const wrn = (s) => `${c.yellow}⚠${c.reset} ${s}`;
const hd  = (s) => `\n${c.bold}${c.magenta}${s}${c.reset}\n`;

function banner() {
  console.log(`
${c.bold}${c.magenta}╔══════════════════════════════════════════════════╗
║  Vibe Design MD Architect  ${c.cyan}v${VERSION}${c.magenta}              ║
║  ${c.reset}23-gate design quality enforcer for AI agents${c.magenta}   ║
║  ${c.dim}https://github.com/imMamdouhaboammar/vibe-design-md-architect${c.reset}${c.magenta} ║
╚══════════════════════════════════════════════════╝${c.reset}
`);
}

function usage() {
  banner();
  console.log(`${c.bold}Usage:${c.reset}  npx vibe-design-md-architect <command> [args]\n`);

  const COMMANDS = [
    ['autopilot',  'ONE command: repair loop, all gates, auto-fix, VDMA-FIXES.md  [--max-passes=3]'],
    ['init',       'Install skill into .claude/skills/ (project) or ~/.claude/skills/ (global)'],
    ['preflight',  'Full step-by-step preflight: Impeccable, intake, standards, validate, gates, scan'],
    ['gates',      'Run all 23 hard-blocking gates  [DESIGN.md] [PRODUCT.md] [src/]'],
    ['validate',   'Validate DESIGN.md six-section contract  [DESIGN.md]'],
    ['score',      'Score DESIGN.md quality against the rubric  [DESIGN.md] [PRODUCT.md]'],
    ['repair',     'Auto-repair DESIGN.md + PRODUCT.md in one shot  [DESIGN.md] [PRODUCT.md]'],
    ['scan',       'Scan frontend source for AI slop and accessibility issues  [src/]'],
    ['scan:a11y',  'Run deep ARIA/landmark/semantics audit  [src/]  [--strict]'],
    ['scan:viewport', 'Run viewport fit scan (requires Playwright)  [http://localhost:3000]'],
    ['amplify',    'Amplify (repair) an old or weak DESIGN.md  [DESIGN.md] [PRODUCT.md]'],
    ['intake',     'Produce INTAKE.session.md from prompts and inferred context'],
    ['standards',  'Generate 2026 standards search brief  [PRODUCT.md] [DESIGN.md]'],
    ['help',       'Show this help message'],
  ];

  for (const [cmd, desc] of COMMANDS) {
    console.log(`  ${c.cyan}${cmd.padEnd(16)}${c.reset}  ${c.dim}${desc}${c.reset}`);
  }

  console.log(`${c.bold}The one command you need:${c.reset}`);
  console.log(`  ${c.bold}${c.magenta}npx vdma autopilot${c.reset}  ${c.dim}← runs everything, repairs everything${c.reset}`);
  console.log(`\n${c.bold}More examples:${c.reset}`);
  console.log(`  ${c.dim}npx vibe-design-md-architect autopilot --max-passes=5${c.reset}`);
  console.log(`  ${c.dim}npx vibe-design-md-architect init${c.reset}`);
  console.log(`  ${c.dim}npx vibe-design-md-architect repair${c.reset}`);
  console.log(`  ${c.dim}npx vibe-design-md-architect gates DESIGN.md PRODUCT.md src/${c.reset}`);
  console.log(`  ${c.dim}npx vibe-design-md-architect scan src/${c.reset}`);
  console.log(`  ${c.dim}npx vibe-design-md-architect amplify DESIGN.md PRODUCT.md${c.reset}`);
  console.log(`\n${c.bold}Docs:${c.reset}   https://github.com/imMamdouhaboammar/vibe-design-md-architect\n`);
}

function run(script, args = [], opts = {}) {
  const scriptPath = join(SKILL_ROOT, 'scripts', script);
  if (!existsSync(scriptPath)) {
    console.error(err(`Script not found: ${scriptPath}`));
    process.exit(1);
  }
  const result = spawnSync('node', [scriptPath, ...args], {
    stdio: 'inherit',
    cwd: opts.cwd || process.cwd(),
    env: { ...process.env, FORCE_COLOR: '1' },
  });
  return result.status ?? 0;
}

function detectArgs(argv, defaults) {
  return argv.length ? argv : defaults.filter(existsSync);
}

function printStep(n, total, label) {
  console.log(`\n${c.bold}${c.blue}[${n}/${total}]${c.reset} ${c.bold}${label}${c.reset}`);
}

function divider() {
  console.log(`${c.dim}${'─'.repeat(52)}${c.reset}`);
}

function cmdInit(argv) {
  banner();
  const global = argv.includes('--global') || argv.includes('-g');
  const dest = global
    ? join(os.homedir(), '.claude', 'skills', 'vibe-design-md-architect')
    : join(process.cwd(), '.claude', 'skills', 'vibe-design-md-architect');

  console.log(hd('Installing vibe-design-md-architect'));
  console.log(inf(`Target: ${dest}`));

  if (existsSync(dest)) console.log(wrn('Skill already installed at this location. Updating...'));

  mkdirSync(dest, { recursive: true });

  const dirs = ['scripts', 'references', 'assets', 'evals'];
  const files = ['SKILL.md', 'README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'package.json', 'skills.sh.json'];

  for (const d of dirs) {
    const src = join(SKILL_ROOT, d);
    if (existsSync(src)) {
      cpSync(src, join(dest, d), { recursive: true });
      console.log(ok(`Copied ${d}/`));
    }
  }
  for (const f of files) {
    const src = join(SKILL_ROOT, f);
    if (existsSync(src)) {
      cpSync(src, join(dest, f));
      console.log(ok(`Copied ${f}`));
    }
  }

  console.log(`\n${ok('Skill installed successfully!')}`);
  console.log(inf(`Path: ${dest}`));
  console.log(inf('Claude will now pick up the skill automatically on next invocation.'));
  console.log(`\n${c.bold}Next step:${c.reset}`);
  console.log(`  Run ${c.cyan}npx vibe-design-md-architect preflight${c.reset} from your project root.\n`);
}

function cmdPreflight(argv) {
  banner();
  console.log(hd('Running full design preflight'));
  divider();

  const cwd = process.cwd();
  const steps = [
    ['Impeccable setup check', () => {
      console.log(inf('Running: npx impeccable skills install'));
      const r = spawnSync('npx', ['impeccable', 'skills', 'install'], {
        stdio: 'inherit', cwd, shell: true,
        env: { ...process.env, npm_config_yes: 'true' },
      });
      if (r.status !== 0) console.log(wrn('Impeccable install failed or unavailable. Continuing manually.'));
    }],
    ['Bootstrap artifacts',     () => run('bootstrap-design-artifacts.mjs', [])],
    ['Intake session',          () => run('intake-session.mjs', [])],
    ['Standards search brief',  () => run('standards-search-brief.mjs', detectArgs([], ['PRODUCT.md', 'DESIGN.md']))],
    ['Auto-repair artifacts',   () => run('repair-design-md.mjs', detectArgs([], ['DESIGN.md', 'PRODUCT.md']))],
    ['Validate DESIGN.md',      () => run('validate-design-md.mjs', detectArgs([], ['DESIGN.md']))],
    ['Score DESIGN.md',         () => run('score-design-md.mjs', detectArgs([], ['DESIGN.md', 'PRODUCT.md']))],
    ['Run all 23 gates',        () => run('run-gates.mjs', detectArgs([], ['DESIGN.md', 'PRODUCT.md', 'src']))],
    ['Scan UI implementation',  () => {
      const src = ['src', 'app', 'pages', 'components'].find(existsSync);
      if (src) return run('scan-ui-implementation.mjs', [src]);
      console.log(wrn('No src/ directory found. Skipping UI scan.'));
    }],
    ['Scan accessibility',      () => {
      const src = ['src', 'app', 'pages', 'components'].find(existsSync);
      if (src) return run('scan-accessibility.mjs', [src]);
      console.log(wrn('No src/ directory found. Skipping a11y scan.'));
    }],
  ];

  let failed = 0;
  steps.forEach(([label, fn], i) => {
    printStep(i + 1, steps.length, label);
    try {
      const status = fn();
      if (status && status !== 0) failed++;
    } catch (e) {
      console.error(err(e.message));
      failed++;
    }
  });

  divider();
  if (failed === 0) {
    console.log(`\n${c.bold}${c.green}✓ Preflight complete. All gates passed.${c.reset}`);
    console.log(inf('You may now proceed to UI implementation.\n'));
  } else {
    console.log(`\n${c.bold}${c.red}✗ Preflight finished with ${failed} failure(s).${c.reset}`);
    console.log(wrn('Repair gate failures before proceeding to implementation.\n'));
    process.exit(1);
  }
}

function cmdGates(argv) {
  banner();
  const args = detectArgs(argv, ['DESIGN.md', 'PRODUCT.md', 'src'].filter(existsSync));
  console.log(hd('Running 23 hard-blocking gates'));
  console.log(inf(`Args: ${args.join(' ') || '(auto-detected)'}`));
  process.exit(run('run-gates.mjs', args));
}

function cmdValidate(argv) {
  const args = detectArgs(argv, ['DESIGN.md'].filter(existsSync));
  console.log(hd('Validating DESIGN.md'));
  process.exit(run('validate-design-md.mjs', args));
}

function cmdScore(argv) {
  const args = detectArgs(argv, ['DESIGN.md', 'PRODUCT.md'].filter(existsSync));
  console.log(hd('Scoring DESIGN.md'));
  process.exit(run('score-design-md.mjs', args));
}

function cmdScan(argv) {
  const src = argv[0] || ['src', 'app', 'pages', 'components'].find(existsSync) || 'src';
  console.log(hd('Scanning UI implementation'));
  console.log(inf(`Source: ${src}`));
  process.exit(run('scan-ui-implementation.mjs', [src]));
}

function cmdScanA11y(argv) {
  const src = argv[0] || ['src', 'app', 'pages', 'components'].find(existsSync) || 'src';
  const strict = argv.includes('--strict');
  console.log(hd('Running accessibility audit (WCAG 2.2)'));
  console.log(inf(`Source: ${src}${strict ? ' --strict' : ''}`));
  const args = [src, ...(strict ? ['--strict'] : [])];
  process.exit(run('scan-accessibility.mjs', args));
}

function cmdScanViewport(argv) {
  const url = argv[0] || 'http://localhost:3000';
  console.log(hd('Running viewport fit scan (Playwright)'));
  console.log(inf(`URL: ${url}`));
  process.exit(run('scan-viewport-fit.mjs', [url]));
}

function cmdAmplify(argv) {
  const args = detectArgs(argv, ['DESIGN.md', 'PRODUCT.md'].filter(existsSync));
  console.log(hd('Amplify Mode: repairing DESIGN.md'));
  console.log(inf('Output: DESIGN.amplified.md + DESIGN.amplification-report.md'));
  process.exit(run('amplify-design-md.mjs', args));
}

function cmdIntake(argv) {
  console.log(hd('Intake session'));
  process.exit(run('intake-session.mjs', argv));
}

function cmdStandards(argv) {
  const args = detectArgs(argv, ['PRODUCT.md', 'DESIGN.md'].filter(existsSync));
  console.log(hd('2026 Standards search brief'));
  process.exit(run('standards-search-brief.mjs', args));
}

function cmdRepair(argv) {
  const args = detectArgs(argv, ['DESIGN.md', 'PRODUCT.md'].filter(existsSync));
  console.log(hd('Auto-repair DESIGN.md + PRODUCT.md'));
  process.exit(run('repair-design-md.mjs', args));
}

function cmdAutopilot(argv) {
  banner();
  console.log(`${c.bold}${c.magenta}AUTOPILOT MODE${c.reset}: one command, full repair loop, all gates\n`);
  process.exit(run('autopilot.mjs', argv));
}

const [,, cmd = 'help', ...rest] = process.argv;
const routes = {
  autopilot:       () => cmdAutopilot(rest),
  init:            () => cmdInit(rest),
  preflight:       () => cmdPreflight(rest),
  gates:           () => cmdGates(rest),
  validate:        () => cmdValidate(rest),
  score:           () => cmdScore(rest),
  repair:          () => cmdRepair(rest),
  scan:            () => cmdScan(rest),
  'scan:a11y':     () => cmdScanA11y(rest),
  'scan:viewport': () => cmdScanViewport(rest),
  amplify:         () => cmdAmplify(rest),
  intake:          () => cmdIntake(rest),
  standards:       () => cmdStandards(rest),
  help:            () => usage(),
  '--help':        () => usage(),
  '-h':            () => usage(),
  '--version':     () => console.log(VERSION),
  '-v':            () => console.log(VERSION),
};

const handler = routes[cmd];
if (!handler) {
  console.error(err(`Unknown command: ${cmd}`));
  usage();
  process.exit(1);
}

handler();
