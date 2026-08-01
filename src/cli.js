import { autopilot } from './commands/autopilot.js';
import { init } from './commands/init.js';
import { audit } from './commands/audit.js';
import { repair } from './commands/repair.js';
import { report } from './commands/report.js';
import { doctor } from './commands/doctor.js';
import { update } from './commands/update.js';
import { standards } from './commands/standards.js';
import { loopCommand as loop } from './commands/loop.js';
import { reviewCommand as review } from './commands/review.js';
import { parseArgs, printHelp } from './core/output.js';

const commands = { autopilot, preflight: autopilot, init, audit, repair, report, doctor, update, standards, loop, review };

function applyExitCode(parsed, result) {
  if ((parsed.flags.ci || parsed.flags.strict) && result?.summary?.errors > 0) process.exitCode = 1;
}

function rejectUnknownCommand(command) {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
  return printHelp();
}

function maxPassesError(flags) {
  const raw = flags.maxPasses;
  if (raw === undefined) return null;
  if (raw === true) return '--max-passes requires a value. Use --max-passes=<number>.';
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) return '--max-passes must be a whole number between 1 and 10.';

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > 10) {
    return '--max-passes must be a whole number between 1 and 10.';
  }
  return null;
}

function verifyTimeoutError(flags, argv) {
  const rawArg = argv.find((item) => item.startsWith('--verify-timeout='));
  if (rawArg && rawArg.indexOf('=', rawArg.indexOf('=') + 1) !== -1) {
    return '--verify-timeout must be a positive whole number of seconds.';
  }

  const raw = flags.verifyTimeout;
  if (raw === undefined) return null;
  if (raw === true) return '--verify-timeout requires a value. Use --verify-timeout=<seconds>.';
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) {
    return '--verify-timeout must be a positive whole number of seconds.';
  }

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1) {
    return '--verify-timeout must be a positive whole number of seconds.';
  }
  return null;
}

function rejectInvalidFlags(parsed, argv) {
  const error = maxPassesError(parsed.flags) || verifyTimeoutError(parsed.flags, argv);
  if (!error) return false;
  console.error(`Invalid option: ${error}`);
  process.exitCode = 1;
  return true;
}

export async function run(argv, meta = {}) {
  const parsed = parseArgs(argv);
  if (parsed.flags.version) return console.log(meta.version || '0.0.0');
  if (parsed.flags.help || parsed.command === 'help' || !parsed.command) return printHelp();
  if (rejectInvalidFlags(parsed, argv)) return null;

  if (parsed.flags.standards) {
    try {
      const { loadStandardsPack } = await import('./core/standardsPacks.js');
      loadStandardsPack(parsed.flags.standards);
    } catch (e) {
      console.error(`\x1b[31m\x1b[1mError:\x1b[0m ${e.message}`);
      process.exitCode = 1;
      return null;
    }
  }

  const command = parsed.command;
  if (command === 'scan') {
    const mod = await import('./commands/scan.js');
    const result = await mod.scan(parsed);
    applyExitCode(parsed, result);
    return result;
  }
  if (!commands[command]) return rejectUnknownCommand(command);
  const result = await commands[command](parsed);
  applyExitCode(parsed, result);
  return result;
}
