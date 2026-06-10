import { runAudit } from '../core/auditor.js';
import { printResult } from '../core/output.js';
export async function audit({ cwd, flags }) { const result = { ...runAudit(cwd), nextCommand: 'vibe-design-md-architect repair --report' }; printResult(result, flags); return result; }
