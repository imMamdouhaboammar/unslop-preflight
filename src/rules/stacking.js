import { rule } from './utils.js';

export const stackingRules = [
  rule('stacking-plan-missing', 'Stacked UI needs a plan before implementation', 'visual-layering-reasoning', 'error', 'DESIGN.md', (ctx) => /modal|dialog|drawer|dropdown|tooltip|toast|sticky header|fixed header/i.test(ctx.files['DESIGN.md'] || '') && !/stacking plan|root cause|placement plan/i.test(ctx.files['DESIGN.md'] || ''), 'Add a stacking plan before implementation.')
];
