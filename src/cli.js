import { autopilot } from './commands/autopilot.js';
import { init } from './commands/init.js';
import { audit } from './commands/audit.js';
import { repair } from './commands/repair.js';
import { report } from './commands/report.js';
import { doctor } from './commands/doctor.js';
import { update } from './commands/update.js';
import { standards } from './commands/standards.js';
import { parseArgs, printHelp } from './core/output.js';
const commands = { autopilot, preflight: autopilot, init, audit, repair, report, doctor, update, standards };
function applyExitCode(parsed, result) {
  if ((parsed.flags.ci || parsed.flags.strict) && result?.summary?.errors > 0) process.exitCode = 1;
}
export async function run(argv, meta = {}) {
  const parsed = parseArgs(argv);
  if (parsed.flags.version) return console.log(meta.version || '0.0.0');
  if (parsed.flags.help || parsed.command === 'help' || !parsed.command) return printHelp();

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
  if (!commands[command]) return printHelp();
  const result = await commands[command](parsed);
  applyExitCode(parsed, result);
  return result;
}
