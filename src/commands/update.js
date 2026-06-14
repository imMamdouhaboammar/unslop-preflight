import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export async function update(parsed) {
  const cwd = parsed.cwd || process.cwd();
  
  let isLocal = false;
  const pkgPath = path.join(cwd, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      // Don't run local update if we are inside the unslop repo itself
      if (pkg.name !== 'unslop') {
        if (
          (pkg.dependencies && pkg.dependencies['unslop']) ||
          (pkg.devDependencies && pkg.devDependencies['unslop'])
        ) {
          isLocal = true;
        }
      }
    } catch(e) {}
  }

  console.log('\x1b[36m🔄 Checking for updates...\x1b[0m');
  
  try {
    if (isLocal) {
      console.log('\x1b[33m📦 Updating local project dependency...\x1b[0m');
      execSync('npm install unslop@latest', { stdio: 'inherit', cwd });
    } else {
      console.log('\x1b[34m🌍 Updating global installation...\x1b[0m');
      execSync('npm install -g unslop@latest', { stdio: 'inherit' });
    }
    
    return {
      summary: { score: 100, checks: 1, errors: 0, warnings: 0, info: 1 },
      issues: [],
      info: ['Successfully updated to the latest version.']
    };
  } catch (err) {
    return {
      summary: { score: 0, checks: 1, errors: 1, warnings: 0, info: 0 },
      issues: [{ id: 'update-failed', severity: 'error', title: 'Failed to update via NPM', suggestedFix: 'Check your npm permissions (e.g., sudo) or network connection.' }]
    };
  }
}
