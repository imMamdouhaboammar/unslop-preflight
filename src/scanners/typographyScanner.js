export const typographyRules = [
  {
    name: 'oversized-typography-mobile-risk',
    level: 'warning',
    pattern: /text-(7xl|8xl|9xl|\[80px\]|\[90px\]|\[100px\])/i,
    heuristic: (content, file, findings) => {
      if (/text-(7xl|8xl|9xl)/i.test(content)) {
        // If it uses huge text without a responsive prefix like md:text-7xl or clamp
        if (!/md:text-|sm:text-|clamp/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /text-(7xl|8xl|9xl)/i.test(l)) + 1,
            level: 'warning',
            rule: 'oversized-typography-mobile-risk',
            excerpt: 'Oversized text utility found without a responsive constraint. This will break mobile layouts.'
          });
        }
      }
    }
  },
  {
    name: 'leading-none-cutoff-risk',
    level: 'warning',
    pattern: /leading-none/i,
    heuristic: (content, file, findings) => {
      if (/leading-none/i.test(content) && /text-(4xl|5xl|6xl|7xl|8xl)/i.test(content)) {
        findings.push({
          file,
          line: content.split(/\r?\n/).findIndex(l => /leading-none/i.test(l)) + 1,
          level: 'info',
          rule: 'leading-none-cutoff-risk',
          excerpt: '`leading-none` on large text can clip descenders (like j, p, q, y). Consider `leading-tight` instead.'
        });
      }
    }
  },
  {
    name: 'long-arabic-text-height',
    level: 'info',
    pattern: /text-(justify|center).*?leading-none/i,
    heuristic: (content, file, findings) => {
      // Just a placeholder heuristic for Arabic/RTL text line-height issues
      // To be expanded in root-cause mode
    }
  }
];
