import { exists, writeText } from '../core/filesystem.js';
import { templateFor } from '../core/templates.js';
import { runAudit } from '../core/auditor.js';
import { printResult } from '../core/output.js';
import { activeAgentInstructionFile } from '../core/agentInstructions.js';

export async function init({ cwd, flags }) {
  const generated = [];
  const agentInstructionFile = activeAgentInstructionFile(cwd);

  for (const file of ['PRODUCT.md', 'DESIGN.md', agentInstructionFile]) {
    if (!exists(cwd, file)) {
      writeText(cwd, file, templateFor(file), flags);
      generated.push(file);
    }
  }

  const result = {
    ...runAudit(cwd),
    generated,
    changed: [],
    repairs: generated.map((file) => ({ file, action: 'created template' })),
    nextCommand: 'npx unslop-preflight audit'
  };

  printResult(result, flags);
  return result;
}
