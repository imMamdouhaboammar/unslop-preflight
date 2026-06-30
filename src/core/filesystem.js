import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function readText(cwd, file) {
  const p = resolve(cwd, file);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

export function exists(cwd, file) {
  return existsSync(resolve(cwd, file));
}

function isDryRun(flags = {}) {
  return Boolean(flags.dryRun || flags['dry-run']);
}

export function writeText(cwd, file, content, flags = {}) {
  const p = resolve(cwd, file);
  if (isDryRun(flags)) return;

  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, 'utf8');
}

export function appendMarkdownBlock(cwd, file, content, flags = {}) {
  const existing = readText(cwd, file) ?? '';
  const block = content.trim();
  const next = existing.trimEnd()
    ? `${existing.trimEnd()}\n\n${block}\n`
    : `${block}\n`;

  writeText(cwd, file, next, flags);
}

export function appendText(cwd, file, content, flags = {}) {
  appendMarkdownBlock(cwd, file, content, flags);
}
