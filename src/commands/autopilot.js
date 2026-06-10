import { runAudit, summarize } from '../core/auditor.js';
import { applyRepairs } from '../core/repair.js';
import { writeReports } from '../core/report.js';
import { printResult } from '../core/output.js';

export async function autopilot({ cwd, flags }) { 
  const first = runAudit(cwd); 
  const patch = applyRepairs(cwd, first.issues, flags); 
  const finalAudit = runAudit(cwd); 
  const result = summarize({ ...finalAudit, ...patch }); 
  
  result.reportFiles = writeReports(cwd, result, flags); 
  result.nextCommand = 'vibe-design-md-architect audit --strict'; 
  result.suggestedPrompt = 'Inspect PRODUCT.md, DESIGN.md, and AGENT.md. Read `.vibe-design/fix-list.md` and resolve any listed issues. Implement the requested scope while preserving existing behavior. **MANDATORY**: Before you complete this task, you MUST run `npx vibe-design-md-architect audit` in the terminal, ensure there are 0 errors, and show me the final output score.';
  
  printResult(result, flags); 
  return result; 
}
