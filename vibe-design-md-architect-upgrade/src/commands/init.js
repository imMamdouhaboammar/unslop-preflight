import { exists, writeText } from '../core/filesystem.js';
import { templateFor } from '../core/templates.js';
import { runAudit } from '../core/auditor.js';
import { printResult } from '../core/output.js';
export async function init({ cwd, flags }) {
  const generated = [];
  for (const file of ['PRODUCT.md','DESIGN.md','AGENT.md']) if (!exists(cwd, file)) { writeText(cwd, file, templateFor(file), flags); generated.push(file); }
  const result = { ...runAudit(cwd), generated, changed: [], repairs: generated.map((file) => ({ file, action: 'created template' })), nextCommand: 'vibe-design-md-architect audit' };
  printResult(result, flags); return result;
}
