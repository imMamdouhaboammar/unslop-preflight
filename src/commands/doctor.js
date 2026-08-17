import { existsSync, accessSync, constants } from 'node:fs';
import { resolve } from 'node:path';
import { summarize } from '../core/auditor.js';
import { printResult } from '../core/output.js';
import { activeAgentInstructionFile } from '../core/agentInstructions.js';

export async function doctor({ cwd, flags }) { 
  const issues = []; 
  
  const nodeVersion = process.versions.node;
  const major = parseInt(nodeVersion.split('.')[0], 10);
  if (major < 18) {
    issues.push({ id: 'node-version-too-old', title: `Node version ${nodeVersion} is too old.`, category: 'runtime', severity: 'error', suggestedFix: 'Upgrade to Node >= 18' });
  }

  if (!existsSync(resolve(cwd, 'package.json'))) {
    issues.push({ id: 'package-json-missing', title: 'package.json not found in current directory', category: 'runtime', severity: 'error', suggestedFix: 'Run from a project root.' });
  }
  
  if (!existsSync(resolve(cwd, '.git'))) {
    issues.push({ id: 'git-repo-missing', title: 'Not a git repository.', category: 'runtime', severity: 'error', suggestedFix: 'Run `git init` to track changes safely.' });
  }

  try { 
    accessSync(cwd, constants.W_OK); 
  } catch { 
    issues.push({ id: 'cwd-not-writable', title: 'Current directory is not writable', category: 'runtime', severity: 'error', suggestedFix: 'Fix permissions or choose another directory.' }); 
  }
  
  for (const f of ['PRODUCT.md', 'DESIGN.md']) {
    if (!existsSync(resolve(cwd, f))) {
      issues.push({ id: `${f.toLowerCase()}-missing`, title: `${f} is not yet created.`, category: 'runtime', severity: 'info', suggestedFix: `Run \`npx unslop-preflight init\` to create it.` });
    }
  }

  const agentInstructionFile = activeAgentInstructionFile(cwd);
  if (!existsSync(resolve(cwd, agentInstructionFile))) {
    issues.push({
      id: 'agents.md-missing',
      title: 'AGENTS.md is not yet created.',
      category: 'runtime',
      severity: 'info',
      suggestedFix: 'Run `npx unslop-preflight init` to create it.'
    });
  }

  const result = summarize({ issues, generated: [], changed: [], repairs: [] }); 
  result.nextCommand = 'npx unslop-preflight autopilot'; 
  printResult(result, flags); 
  return result; 
}
