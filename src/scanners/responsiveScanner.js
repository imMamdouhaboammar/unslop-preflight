export const responsiveRules = [
  {
    name: 'fixed-width-mobile-risk',
    level: 'blocker',
    pattern: /w-\[(3[0-9]{2}px|4[0-9]{2}px|5[0-9]{2}px)\]|w-(72|80|96)/i,
    heuristic: (content, file, findings) => {
      if (/w-\[(3[0-9]{2}px|4[0-9]{2}px|5[0-9]{2}px)\]|w-(72|80|96)/i.test(content)) {
        if (!/max-w-/i.test(content) && !/md:w-|sm:w-/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /w-(72|80|96|\[3)/i.test(l)) + 1,
            level: 'blocker',
            rule: 'fixed-width-mobile-risk',
            excerpt: 'Fixed wide width without a max-width constraint or responsive breakpoint. Will cause horizontal scroll on mobile.'
          });
        }
      }
    }
  },
  {
    name: 'height-100vh-mobile-risk',
    level: 'warning',
    pattern: /h-screen|height:\s*100vh|h-100vh|h-\[100vh\]/i,
    heuristic: (content, file, findings) => {
      if (/h-screen|height:\s*100vh|h-100vh|h-\[100vh\]/i.test(content)) {
        if (!/h-dvh|min-h-screen/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /h-screen|100vh/i.test(l)) + 1,
            level: 'warning',
            rule: 'height-100vh-mobile-risk',
            excerpt: '`h-screen` or `100vh` detected. On mobile Safari/Chrome, this ignores the browser address bar. Use `h-dvh` or `min-h-screen`.'
          });
        }
      }
    }
  },
  {
    name: 'table-mobile-overflow',
    level: 'warning',
    pattern: /<table/i,
    heuristic: (content, file, findings) => {
      if (/<table/i.test(content)) {
        if (!/overflow-x-auto|table-auto|w-full/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /<table/i.test(l)) + 1,
            level: 'warning',
            rule: 'table-mobile-overflow',
            excerpt: 'Table detected without an `overflow-x-auto` wrapper. Tables break mobile layouts if not wrapped.'
          });
        }
      }
    }
  }
];
