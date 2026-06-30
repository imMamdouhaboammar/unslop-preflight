import { autopilot } from './commands/autopilot.js';
import { init } from './commands/init.js';
import { audit } from './commands/audit.js';
import { repair } from './commands/repair.js';
import { report } from './commands/report.js';
import { doctor } from './commands/doctor.js';
import { update } from './commands/update.js';
import { parseArgs, printHelp } from './core/output.js';
const commands = { autopilot, init, audit, repair, report, doctor, update };
export async function run(argv, meta = {}) {
  const parsed = parseArgs(argv);
  if (parsed.flags.version) return console.log(meta.version || '0.0.0');
  if (parsed.flags.help || parsed.command === 'help' || !parsed.command) return printHelp();
  const command = parsed.command;
  if (!commands[command]) return printHelp();
  const result = await commands[command](parsed);
  return result;
}
