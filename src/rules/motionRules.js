export const MOTION_RULES = [
  {
    id: 'motion-restraint-high-frequency',
    severity: 'MEDIUM',
    message: 'Do not add heavy animations to high-frequency triggers (keystrokes, hover loops).'
  },
  {
    id: 'interruptible-transitions',
    severity: 'LOW',
    message: 'Prefer CSS transitions over keyframe loops for interactive state changes.'
  }
];
