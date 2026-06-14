export const layeringRules = [
  {
    name: 'arbitrary-z-index-slop',
    level: 'warning',
    pattern: /z-\[9{3,}\]|z-9999/i,
    heuristic: (content, file, findings) => {
      if (/z-\[9{3,}\]|z-9999/i.test(content)) {
        findings.push({
          file,
          line: content.split(/\r?\n/).findIndex(l => /z-\[9{3,}\]|z-9999/i.test(l)) + 1,
          level: 'warning',
          rule: 'arbitrary-z-index-slop',
          excerpt: 'Extreme arbitrary z-index detected (e.g. z-9999). Use structured layers (e.g., z-40, z-50) or stacking contexts.'
        });
      }
    }
  },
  {
    name: 'fixed-inside-transform-bug',
    level: 'blocker',
    pattern: /transform|translate/i,
    heuristic: (content, file, findings) => {
      // Very basic static check. Hard to do perfectly without AST, but we flag if both exist close to each other.
      if (/(transform|translate).*?(fixed|absolute)|(fixed|absolute).*?(transform|translate)/i.test(content)) {
        if (/className=["'][^"']*(transform|translate)[^"']*(fixed)[^"']*["']/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /fixed/i.test(l)) + 1,
            level: 'blocker',
            rule: 'fixed-inside-transform-bug',
            excerpt: 'Fixed positioning combined with CSS transforms can break viewport anchoring.'
          });
        }
      }
    }
  },
  {
    name: 'blind-overflow-hidden',
    level: 'warning',
    pattern: /overflow-hidden/i,
    heuristic: (content, file, findings) => {
      // Flag if overflow-hidden is used on a generic container that might house a dropdown
      if (/overflow-hidden.*?(dropdown|popover|select|menu)/i.test(content)) {
        findings.push({
          file,
          line: content.split(/\r?\n/).findIndex(l => /overflow-hidden/i.test(l)) + 1,
          level: 'warning',
          rule: 'blind-overflow-hidden',
          excerpt: '`overflow-hidden` used near a dropdown or menu element. This will clip floating UI elements.'
        });
      }
    }
  }
];
