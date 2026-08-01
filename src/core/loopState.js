import fs from 'node:fs';
import path from 'node:path';

export function readLoopState(dir = process.cwd()) {
  const statePath = path.join(dir, 'STATE.md');
  if (!fs.existsSync(statePath)) {
    return { active: false, loops: [] };
  }
  const content = fs.readFileSync(statePath, 'utf8');
  return { active: true, content };
}
