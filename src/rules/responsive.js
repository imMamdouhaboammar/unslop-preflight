import { rule } from './utils.js';

export const responsiveRules = [
  rule('deterministic-mobile-behavior', 'DESIGN.md must use deterministic mobile styling', 'responsive-design', 'error', 'DESIGN.md', (ctx) => {
    const d = ctx.files['DESIGN.md'];
    if (!d) return false;
    return /mobile/i.test(d) && !/(flex-col|w-full|block)/i.test(d);
  }, 'Replace generic mobile advice with explicit tokens (e.g., Use flex-col and w-full).', 'auto'),
  
  rule('deterministic-tablet-behavior', 'DESIGN.md must use deterministic tablet styling', 'responsive-design', 'info', 'DESIGN.md', (ctx) => {
    const d = ctx.files['DESIGN.md'];
    if (!d) return false;
    return /tablet/i.test(d) && !/(md:grid|md:flex|md:)/i.test(d);
  }, 'Replace generic tablet advice with explicit breakpoint prefixes (e.g., md:grid-cols-2).', 'auto'),
  
  rule('height-100vh-mobile-risk', 'height: 100vh appears without mobile viewport caveat', 'responsive-design', 'error', 'DESIGN.md', (ctx) => {
    return ctx.files['DESIGN.md'] && /height\s*:\s*100vh/i.test(ctx.files['DESIGN.md']) && !/100dvh|svh|mobile viewport|safe viewport/i.test(ctx.files['DESIGN.md']);
  }, 'Use min-height: 100dvh or document mobile viewport caveat.', 'auto')
];
