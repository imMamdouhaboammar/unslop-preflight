import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
export function readText(cwd, file) { const p = resolve(cwd, file); return existsSync(p) ? readFileSync(p, 'utf8') : null; }
export function exists(cwd, file) { return existsSync(resolve(cwd, file)); }
export function writeText(cwd, file, content, { dryRun = false } = {}) { const p = resolve(cwd, file); if (dryRun) return; mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content, 'utf8'); }
export function appendText(cwd, file, content, { dryRun = false } = {}) { const existing = readText(cwd, file) ?? ''; writeText(cwd, file, `${existing.trimEnd()}

${content.trim()}
`, { dryRun }); }
