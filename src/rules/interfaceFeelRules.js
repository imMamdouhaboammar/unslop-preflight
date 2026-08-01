export const POLISH_RULES = [
  {
    id: 'never-transition-all',
    severity: 'HIGH',
    regex: /transition:\s*all\b/i,
    message: 'Never use transition: all. Always specify explicit properties (e.g. transition: transform, opacity).'
  },
  {
    id: 'concentric-border-radius',
    severity: 'MEDIUM',
    regex: /border-radius:\s*(\d+)px/i,
    message: 'Nested border radii should be concentric (outerRadius = innerRadius + padding).'
  },
  {
    id: 'exaggerated-scale-press',
    severity: 'MEDIUM',
    regex: /scale\((0\.(?:[0-8]\d|9[0-4]))\)/,
    message: 'Scale on press must not be smaller than 0.95 (recommended 0.96).'
  },
  {
    id: 'will-change-all',
    severity: 'HIGH',
    regex: /will-change:\s*all\b/i,
    message: 'Never use will-change: all. Specify composite properties (transform, opacity, filter).'
  }
];
