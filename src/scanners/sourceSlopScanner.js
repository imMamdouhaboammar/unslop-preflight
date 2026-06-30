export const sourceSlopRules = [
  {
    name: 'unstable-random-key',
    level: 'blocker',
    pattern: /key=\{?\s*(Math\.random\(\)|Date\.now\(\))/i
  },
  {
    name: 'array-index-key-reorder-risk',
    level: 'warning',
    pattern: /key=\{\s*(index|idx|i)\s*\}|key=["']\s*(index|idx|i)\s*["']/i
  },
  {
    name: 'transition-all-animation-slop',
    level: 'info',
    pattern: /\btransition-all\b/i
  }
];
