export const BANNED_WORDS = [
  'delve', 'foster', 'leverage', 'utilize', 'facilitate', 'empower',
  'streamline', 'robust', 'cutting-edge', 'paradigm shift', 'game changer',
  'tapestry', 'realm', 'beacon', 'multifaceted', 'meticulous', 'intricate',
  'paramount', 'transformative', 'elevate', 'embark', 'supercharge', 'harness',
  'ever-evolving'
];

export const PROSE_PATTERNS = [
  {
    id: 'binary-contrast',
    regex: /\b(this is not|the question isn't|it's not just)\s+[^.]+,\s*(it's|is)\b/i,
    message: 'Binary contrast pattern detected ("Not X, it\'s Y"). State Y directly.'
  },
  {
    id: 'throat-clearing',
    regex: /\b(here's the thing|here's what I mean|let me be clear|the uncomfortable truth is)\b/i,
    message: 'Throat-clearing opener detected. Cut and state the point directly.'
  },
  {
    id: 'superficial-ing-clause',
    regex: /,\s*(highlighting|underscoring|reflecting|showcasing)\b/i,
    message: 'Superficial -ing explanatory clause detected. Explain concrete mechanism instead.'
  },
  {
    id: 'weasel-attribution',
    regex: /\b(experts agree|industry reports suggest|many argue|widely regarded as|studies show)\b/i,
    message: 'Weasel attribution phrase detected. Name specific source or state facts.'
  },
  {
    id: 'colon-reveal',
    regex: /^[A-Z][^:\n]+:\s+[a-z][^.\n]+\./,
    message: 'Colon reveal detected. Replace dramatic colon setup with a direct sentence.'
  }
];
