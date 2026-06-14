export const overlayRules = [
  {
    name: 'modal-without-focus-trap',
    level: 'blocker',
    pattern: /role=["']?(dialog|alertdialog)["']?/i,
    heuristic: (content, file, findings) => {
      // If file contains a dialog but no focus trap library or explicit focus management
      if (/role=["']?(dialog|alertdialog)["']?/i.test(content)) {
        if (!/focus-trap|useFocus|useTrap|Dialog\.Overlay/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /role=["']?(dialog|alertdialog)["']?/i.test(l)) + 1,
            level: 'blocker',
            rule: 'modal-without-focus-trap',
            excerpt: 'Detected dialog without focus trap. Modals must trap focus for accessibility.'
          });
        }
      }
    }
  },
  {
    name: 'overlay-missing-portal',
    level: 'warning',
    pattern: /className=["'].*?(fixed|absolute).*?z-\[?99/i,
    heuristic: (content, file, findings) => {
      // If we see high z-index and fixed positioning without a Portal wrapper
      if (/fixed|absolute/i.test(content) && /z-[4-9]0|z-\[9/i.test(content)) {
        if (!/createPortal|Portal/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /z-[4-9]0|z-\[9/i.test(l)) + 1,
            level: 'warning',
            rule: 'overlay-missing-portal',
            excerpt: 'High z-index overlay detected without a Portal. Use portals for safe stacking.'
          });
        }
      }
    }
  },
  {
    name: 'modal-internal-scroll-risk',
    level: 'warning',
    pattern: /overflow-(y-auto|auto|scroll)/i,
    heuristic: (content, file, findings) => {
      if (/role=["']?(dialog|alertdialog)["']?/i.test(content) && /overflow-(y-auto|auto|scroll)/i.test(content)) {
        if (!/max-h-|max-height/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /overflow-/i.test(l)) + 1,
            level: 'warning',
            rule: 'modal-internal-scroll-risk',
            excerpt: 'Modal with scrollable content lacks a max-height cap, risking cutoff on small viewports.'
          });
        }
      }
    }
  }
];
