import { exists } from './filesystem.js';

export function activeAgentInstructionFile(cwd) {
  if (exists(cwd, 'AGENTS.md')) return 'AGENTS.md';
  if (exists(cwd, 'AGENT.md')) return 'AGENT.md';
  return 'AGENTS.md';
}
