import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.html', '.vue', '.svelte', '.css', '.scss', '.mdx']);
const skipDirs = new Set(['node_modules', '.next', 'dist', 'build', '.git', 'coverage', '.turbo', '.vercel']);

export function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(full, files);
    } else if (exts.has(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function findLine(content, pattern) {
  const lines = content.split(/\r?\n/);
  const index = lines.findIndex((line) => {
    pattern.lastIndex = 0;
    return pattern.test(line);
  });
  return index >= 0 ? index + 1 : 1;
}

function excerptFor(rule, fallback) {
  return (rule.message || fallback || rule.name || 'Review required').trim().slice(0, 220);
}

export function scanWithRules(targetDir, rules) {
  const files = walk(targetDir);
  const findings = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const rule of rules) {
      if (!rule.pattern || rule.scope !== 'file') continue;
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(content)) {
        findings.push({
          file,
          line: findLine(content, rule.pattern),
          level: rule.level || 'blocker',
          rule: rule.name,
          excerpt: excerptFor(rule, rule.pattern.source)
        });
      }
    }
    
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      for (const rule of rules) {
        if (!rule.pattern || rule.scope === 'file') continue;
        rule.pattern.lastIndex = 0;
        if (rule.pattern.test(line)) {
          findings.push({ 
            file, 
            line: index + 1, 
            level: rule.level || 'blocker', 
            rule: rule.name, 
            excerpt: excerptFor(rule, line.trim()) 
          });
        }
      }
    }

    for (const rule of rules) {
      if (rule.heuristic) {
        rule.heuristic(content, file, findings);
      }
    }
  }

  return findings;
}
