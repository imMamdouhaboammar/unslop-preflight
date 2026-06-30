export const vibeCodingRules = [
  {
    name: 'components-importing-pages',
    level: 'blocker',
    heuristic: (content, file, findings) => {
      if (/[/\\]components[/\\]/i.test(file)) {
        const lines = content.split(/\r?\n/);
        // Matches imports referencing 'pages' folder (relative, absolute, or alias-based)
        const importPageRegex = /import\s+.*\s+from\s+['"](?:@\/|\.\.\/|\.\/|)(?:pages)\b/i;
        for (let i = 0; i < lines.length; i++) {
          if (importPageRegex.test(lines[i])) {
            findings.push({
              file,
              line: i + 1,
              level: 'blocker',
              rule: 'components-importing-pages',
              excerpt: `Component imports from pages layer: "${lines[i].trim()}"`
            });
          }
        }
      }
    }
  },
  {
    name: 'component-max-lines',
    heuristic: (content, file, findings) => {
      if (/[/\\]components[/\\]/i.test(file) && /\.(jsx?|tsx?)$/i.test(file)) {
        const lines = content.split(/\r?\n/).length;
        if (lines > 250) {
          findings.push({
            file,
            line: 1,
            level: 'blocker',
            rule: 'component-max-lines',
            excerpt: `Component size limit breached: ${lines} lines (max permitted: 250). Decomposition into sub-components is mandatory.`
          });
        } else if (lines > 150) {
          findings.push({
            file,
            line: 1,
            level: 'warning',
            rule: 'component-max-lines',
            excerpt: `Component size warning: ${lines} lines (max soft limit: 150). Refactor or extract sub-components to improve maintainability.`
          });
        }
      }
    }
  },
  {
    name: 'raw-local-storage-usage',
    level: 'warning',
    excludeFile: /(\.test\.|\.spec\.|storageManager|utils|config)/i,
    pattern: /\b(window\.)?(localStorage|sessionStorage)\.(getItem|setItem|removeItem|clear)\b/i,
    message: 'Direct localStorage/sessionStorage usage detected. Abstracting storage interactions via storageManager or React state is highly recommended.'
  },
  {
    name: 'no-ts-ignore',
    level: 'blocker',
    pattern: /\/\/\s*@ts-ignore\b/,
    message: 'Use of "// @ts-ignore" is forbidden under strict type system standards. Use proper typing, or use "// @ts-expect-error" with a detailed explanation.'
  },
  {
    name: 'hardcoded-secret-keys',
    level: 'blocker',
    excludeFile: /(\.test\.|\.spec\.|fixtures?|mocks?)/i,
    pattern: /\b(api[_-]?key|secret|private[_-]?key|jwt_secret)\s*[:=]\s*['"][a-zA-Z0-9_\-=]{16,}['"]/i,
    message: 'Potential hardcoded secret key, private key, or credential detected. Move all secrets to secure environment variables.'
  }
];
