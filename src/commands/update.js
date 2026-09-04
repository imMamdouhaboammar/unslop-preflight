import { execFileSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const PACKAGE_NAME = 'unslop-preflight';
const LATEST_PACKAGE = `${PACKAGE_NAME}@latest`;

export function planUpdate(
  cwd = process.cwd(),
  platform = process.platform,
  comspec = process.env.ComSpec
) {
  let isLocal = false;
  let isDevOnly = false;
  const pkgPath = path.join(cwd, 'package.json');

  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      const isPackageRepository = pkg.name === PACKAGE_NAME;
      const hasDependency = Boolean(pkg.dependencies?.[PACKAGE_NAME]);
      const hasDevDependency = Boolean(pkg.devDependencies?.[PACKAGE_NAME]);

      isLocal = !isPackageRepository && (hasDependency || hasDevDependency);
      isDevOnly = isLocal && !hasDependency && hasDevDependency;
    } catch {
      // Invalid project metadata cannot safely authorize a local dependency mutation.
    }
  }

  const installArgs = isLocal
    ? ['install', ...(isDevOnly ? ['--save-dev'] : []), LATEST_PACKAGE]
    : ['install', '-g', LATEST_PACKAGE];

  if (platform === 'win32') {
    return {
      scope: isLocal ? 'local' : 'global',
      command: comspec || 'cmd.exe',
      args: ['/d', '/s', '/c', 'npm.cmd', ...installArgs],
      ...(isLocal ? { cwd } : {})
    };
  }

  return {
    scope: isLocal ? 'local' : 'global',
    command: 'npm',
    args: installArgs,
    ...(isLocal ? { cwd } : {})
  };
}

export function executeUpdatePlan(plan, execute = execFileSync) {
  execute(plan.command, plan.args, {
    stdio: 'inherit',
    ...(plan.cwd ? { cwd: plan.cwd } : {})
  });
}

export async function update(parsed) {
  const cwd = parsed.cwd || process.cwd();
  const plan = planUpdate(cwd);

  console.log('\x1b[36m🔄 Checking for updates...\x1b[0m');

  try {
    if (plan.scope === 'local') {
      console.log('\x1b[33m📦 Updating local unslop-preflight dependency...\x1b[0m');
    } else {
      console.log('\x1b[34m🌍 Updating global unslop-preflight installation...\x1b[0m');
    }

    executeUpdatePlan(plan);

    return {
      summary: { score: 100, checks: 1, errors: 0, warnings: 0, info: 1 },
      issues: [],
      info: ['Successfully updated unslop-preflight to the latest version.']
    };
  } catch {
    return {
      summary: { score: 0, checks: 1, errors: 1, warnings: 0, info: 0 },
      issues: [{
        id: 'update-failed',
        severity: 'error',
        title: 'Failed to update unslop-preflight via npm',
        suggestedFix: 'Check your npm permissions (e.g., sudo) or network connection.'
      }]
    };
  }
}
