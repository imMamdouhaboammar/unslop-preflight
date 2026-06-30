export const sourceSlopRules = [
  {
    name: 'unstable-random-key',
    level: 'blocker',
    pattern: /key=\{?\s*(Math\.random\(\)|Date\.now\(\))/i,
    message: 'Unstable key detected. Use a stable entity id instead of random or time-based keys.'
  },
  {
    name: 'array-index-key-reorder-risk',
    level: 'warning',
    pattern: /key=\{\s*(index|idx|i)\s*\}|key=["']\s*(index|idx|i)\s*["']/i,
    message: 'Array index key detected. Confirm the list cannot reorder, insert, filter, or delete items.'
  },
  {
    name: 'outline-none-without-focus-visible',
    level: 'blocker',
    pattern: /\b(focus:)?outline-none\b(?![^"'`]*focus-visible)(?![^"'`]*focus:ring)(?![^"'`]*ring-)/i,
    message: 'Focus outline is removed without a visible keyboard focus replacement.'
  },
  {
    name: 'icon-only-button-review',
    level: 'warning',
    pattern: /<button\b[^>]*>\s*(<svg\b|<\w*Icon\b)/i,
    message: 'Icon-only button detected. Verify it has aria-label, aria-labelledby, sr-only text, or a visible label.'
  },
  {
    name: 'image-without-size-review',
    level: 'warning',
    pattern: /<img\b(?![^>]*(width=|height=|aspect-|w-full|h-auto))/i,
    message: 'Image needs an explicit sizing contract to prevent layout shift.'
  },
  {
    name: 'motion-without-reduced-motion-review',
    level: 'warning',
    scope: 'file',
    pattern: /(framer-motion|<motion\.|whileHover=|whileTap=)(?![\s\S]*(useReducedMotion|prefers-reduced-motion|motion-safe|motion-reduce))/i,
    message: 'Motion behavior detected without a reduced-motion guard.'
  },
  {
    name: 'collection-map-empty-state-review',
    level: 'warning',
    scope: 'file',
    pattern: /\.map\s*\((?![\s\S]*(empty|no results|no data|not found|length\s*===\s*0|\.length\s*\?))/i,
    message: 'Collection rendering appears to lack an empty state.'
  },
  {
    name: 'async-view-state-review',
    level: 'warning',
    scope: 'file',
    pattern: /\b(fetch|axios\.|useSWR|useQuery|useInfiniteQuery|supabase\.)\b(?![\s\S]*(loading|isLoading|pending|skeleton|spinner|aria-busy)[\s\S]*(error|isError|catch\s*\(|onError|ErrorBoundary)[\s\S]*(empty|no results|no data|not found|length\s*===\s*0|isEmpty))/i,
    message: 'Async view should prove loading, error, and empty states before handoff.'
  },
  {
    name: 'hardcoded-color-token-drift',
    level: 'warning',
    pattern: /#[0-9a-f]{3,8}\b/i,
    message: 'Hardcoded color found. Move durable color decisions into tokens or theme files.'
  },
  {
    name: 'generic-ai-aesthetic-stack',
    level: 'info',
    scope: 'file',
    pattern: /(bg-gradient|linear-gradient)[\s\S]*(from-purple|via-purple|to-pink|to-fuchsia|backdrop-blur|glass|shadow-2xl)/i,
    message: 'Generic gradient/glass/heavy-shadow stack detected. Confirm it belongs to the product visual system.'
  },
  {
    name: 'transition-all-animation-slop',
    level: 'info',
    pattern: /\btransition-all\b/i,
    message: 'Broad transition-all found. Prefer targeted transition properties.'
  },
  {
    name: 'sample-data-shipping-risk',
    level: 'warning',
    pattern: /(John Doe|Jane Doe|Acme Corp|lorem ipsum|example\.com|TODO:|TBD|coming soon)/i,
    message: 'Sample or placeholder content detected in source.'
  }
];
