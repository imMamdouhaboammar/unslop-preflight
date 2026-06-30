import { runAudit } from '../core/auditor.js';
import { printResult } from '../core/output.js';

export async function audit({ cwd, flags }) {
  const result = {
    ...runAudit(cwd),
    nextCommand: 'npx unslop-preflight repair --report'
  };
  printResult(result, flags);
  return result;
}
