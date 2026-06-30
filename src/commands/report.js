import { runAudit } from '../core/auditor.js';
import { writeReports } from '../core/report.js';
import { printResult } from '../core/output.js';

export async function report({ cwd, flags }) { 
  const result = runAudit(cwd); 
  result.reportFiles = writeReports(cwd, result, flags); 
  result.changed = result.reportFiles; 
  result.nextCommand = 'Review .unslop/fix-list.md'; 
  result.suggestedPrompt = 'Inspect PRODUCT.md, DESIGN.md, and AGENT.md. Read `.unslop/fix-list.md` and resolve any listed issues. Implement the requested scope while preserving existing behavior. **MANDATORY**: Before you complete this task, you MUST run `npx unslop-preflight audit` in the terminal, ensure there are 0 errors, and show me the final output score.';
  
  printResult(result, flags); 
  return result; 
}
