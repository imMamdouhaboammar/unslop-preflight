import { rule, hasUnresolvedPlaceholders } from './utils.js';

export const placeholderRules = [
  rule(
    'unresolved-design-placeholders',
    'DESIGN.md still contains unresolved placeholders',
    'taste-calibration',
    'error',
    'DESIGN.md',
    (ctx) => hasUnresolvedPlaceholders(ctx.files['DESIGN.md']),
    'Replace placeholder brackets, TODO/TBD, ellipses, and generic draft copy with concrete layout, audience, state, and design-system decisions before implementation.',
    'manual'
  )
];
