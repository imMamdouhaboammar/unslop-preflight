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
    name: 'outline-none-without-focus-visible',
    level: 'blocker',
    pattern: /\b(focus:)?outline-none\b(?![^"'`]*focus-visible)(?![^"'`]*focus:ring)(?![^"'`]*ring-)/i
  },
  {
    name: 'icon-only-button-review',
    level: 'warning',
    pattern: /<button\b[^>]*>\s*(<svg\b|<\w*Icon\b)/i
  },
  {
    name: 'image-without-size-review',
    level: 'warning',
    pattern: /<img\b(?![^>]*(width=|height=|aspect-|w-full|h-auto))/i
  },
  {
    name: 'motion-without-reduced-motion-review',
    level: 'warning',
    pattern: /(framer-motion|<motion\.|whileHover=|whileTap=)(?![\s\S]*(useReducedMotion|prefers-reduced-motion|motion-safe|motion-reduce))/i
  },
  {
    name: 'collection-map-empty-state-review',
    level: 'warning',
    pattern: /\.map\s*\(/i
  },
  {
    name: 'async-view-state-review',
    level: 'warning',
    pattern: /\b(fetch|axios\.|useSWR|useQuery|useInfiniteQuery|supabase\.)\b/i
  },
  {
    name: 'hardcoded-color-token-drift',
    level: 'warning',
    pattern: /#[0-9a-f]{3,8}\b/i
  },
  {
    name: 'generic-ai-aesthetic-stack',
    level: 'info',
    pattern: /(bg-gradient|linear-gradient|from-purple|via-purple|to-pink|to-fuchsia|backdrop-blur|glass|shadow-2xl)/i
  },
  {
    name: 'transition-all-animation-slop',
    level: 'info',
    pattern: /\btransition-all\b/i
  },
  {
    name: 'sample-data-shipping-risk',
    level: 'warning',
    pattern: /(John Doe|Jane Doe|Acme Corp|lorem ipsum|example\.com|TODO:|TBD|coming soon)/i
  }
];
