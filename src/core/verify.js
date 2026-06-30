import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Detect the package manager based on lockfiles present in the directory.
 * Maps:
 * - pnpm-lock.yaml -> pnpm
 * - package-lock.json -> npm
 * - yarn.lock -> yarn
 * - bun.lockb -> bun
 */
export function detectPackageManager(cwd) {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'package-lock.json'))) return 'npm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
}

/**
 * Validate that the command is safe to run.
 * Skips commands that look like dev servers, destructive cleans, or installers.
 */
export function isSafeCommand(scriptName, cmdText) {
  const forbidden = [
    /\bdev\b/, /\bstart\b/, /\bdeploy\b/, /\bpublish\b/, /\binstall\b/,
    /\bclean\b/, /\bdestroy\b/, /\bwatch\b/, /\bserver\b/
  ];
  const combined = `${scriptName} ${cmdText}`.toLowerCase();
  for (const regex of forbidden) {
    if (regex.test(combined)) {
      return false;
    }
  }
  return true;
}

/**
 * Executes standard verification checks: typecheck, lint, test, build.
 * Run in order, synchronously with configurable timeouts.
 */
export function runVerification(cwd, flags = {}) {
  const timeoutSec = Number(flags.verifyTimeout ?? flags['verify-timeout'] ?? 120);
  const timeoutMs = timeoutSec * 1000;
  
  const results = [];
  
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    return results;
  }
  
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch (err) {
    return results;
  }
  
  const scripts = pkg.scripts || {};
  const pm = detectPackageManager(cwd);
  
  const order = ['typecheck', 'lint', 'test', 'build'];
  
  for (const scriptName of order) {
    const cmdText = scripts[scriptName];
    if (!cmdText) {
      results.push({
        command: `${pm} run ${scriptName}`,
        status: 'skipped',
        durationMs: 0,
        exitCode: 0,
        summary: `No script '${scriptName}' found in package.json`
      });
      continue;
    }
    
    if (!isSafeCommand(scriptName, cmdText)) {
      results.push({
        command: `${pm} run ${scriptName}`,
        status: 'skipped',
        durationMs: 0,
        exitCode: 0,
        summary: `Script '${scriptName}' was skipped because it was flagged as potentially unsafe (dev/deploy/install/clean/destroy/watch/server)`
      });
      continue;
    }
    
    const fullCmd = `${pm} run ${scriptName}`;
    const startTime = Date.now();
    
    try {
      const output = execSync(fullCmd, {
        cwd,
        timeout: timeoutMs,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, PAGER: 'cat' }
      });
      
      const durationMs = Date.now() - startTime;
      results.push({
        command: fullCmd,
        status: 'passed',
        durationMs,
        exitCode: 0,
        summary: output.toString('utf8').slice(0, 1000)
      });
    } catch (err) {
      const durationMs = Date.now() - startTime;
      const isTimeout = err.code === 'ETIMEDOUT' || err.signal === 'SIGTERM' || durationMs >= timeoutMs;
      
      const errorOutput = err.stderr?.toString('utf8') || err.stdout?.toString('utf8') || err.message || '';
      results.push({
        command: fullCmd,
        status: isTimeout ? 'timeout' : 'failed',
        durationMs,
        exitCode: err.status ?? 1,
        summary: errorOutput.slice(0, 1000)
      });
    }
  }
  
  return results;
}
