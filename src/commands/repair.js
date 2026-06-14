import { runAudit, summarize } from '../core/auditor.js';
import { applyRepairs } from '../core/repair.js';
import { writeReports } from '../core/report.js';
import { printResult } from '../core/output.js';
export async function repair({ cwd, flags }) { const before = runAudit(cwd); const patch = applyRepairs(cwd, before.issues, flags); const current = runAudit(cwd); const after = summarize({ ...current, ...patch }); if (flags.report) writeReports(cwd, after, flags); after.nextCommand = 'unslop audit'; printResult(after, flags); return after; }
