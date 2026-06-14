import { printResult } from '../core/output.js';
import { runAutopilotPipeline } from '../core/autopilotPlan.js';

export async function autopilot({ cwd, flags }) { 
  const result = runAutopilotPipeline(cwd, flags);
  printResult(result, flags); 
  
  // Set exit code for CI if needed
  if (result.exitCode !== undefined) {
    process.exitCode = result.exitCode;
  }
  
  return result; 
}
