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
    name: 'target-blank-without-rel',
    level: 'blocker',
    pattern: /<a\b(?=[^>]*target=["']_blank["'])(?![^>]*rel=["'][^"']*(noopener|noreferrer)[^"']*["'])/i,
    message: 'target="_blank" link lacks rel="noopener" or rel="noreferrer".'
  },
  {
    name: 'input-without-autocomplete-review',
    level: 'warning',
    pattern: /<input\b(?=[^>]*type=["'](email|password|tel|search)["'])(?![^>]*(autoComplete=|autocomplete=))/i,
    message: 'Input for email, password, tel, or search should declare autocomplete behavior.'
  },
  {
    name: 'motion-without-reduced-motion-review',
    level: 'warning',
    scope: 'file',
    pattern: /^(?=[\s\S]*(framer-motion|<motion\.|whileHover=|whileTap=))(?![\s\S]*(useReducedMotion|prefers-reduced-motion|motion-safe|motion-reduce))[\s\S]*$/i,
    message: 'Motion behavior detected without a reduced-motion guard.'
  },
  {
    name: 'collection-map-empty-state-review',
    level: 'warning',
    scope: 'file',
    pattern: /^(?=[\s\S]*\.map\s*\()(?![\s\S]*(empty|no results|no data|not found|length\s*===\s*0|\.length\s*\?))[\s\S]*$/i,
    message: 'Collection rendering appears to lack an empty state.'
  },
  {
    name: 'async-view-state-review',
    level: 'warning',
    scope: 'file',
    pattern: /^(?=[\s\S]*\b(fetch|axios\.|useSWR|useQuery|useInfiniteQuery|supabase\.)\b)(?!(?=[\s\S]*(loading|isLoading|pending|skeleton|spinner|aria-busy))(?=[\s\S]*(error|isError|catch\s*\(|onError|ErrorBoundary))(?=[\s\S]*(empty|no results|no data|not found|length\s*===\s*0|isEmpty)))[\s\S]*$/i,
    message: 'Async view should prove loading, error, and empty states before handoff.'
  },
  {
    name: 'hardcoded-color-token-drift',
    level: 'warning',
    excludeFile: /(tokens?|theme|tailwind\.config|globals\.css|variables|\.test\.|\.spec\.|stories\.)/i,
    pattern: /#[0-9a-f]{3,8}\b/i,
    message: 'Hardcoded color found. Move durable color decisions into tokens or theme files.'
  },
  {
    name: 'generic-ai-aesthetic-stack',
    level: 'info',
    scope: 'file',
    pattern: /^(?=[\s\S]*(bg-gradient|linear-gradient))(?=[\s\S]*(from-purple|via-purple|to-pink|to-fuchsia))(?=[\s\S]*(backdrop-blur|glass|shadow-2xl))[\s\S]*$/i,
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
    excludeFile: /(\.test\.|\.spec\.|stories\.|fixtures?|mocks?)/i,
    pattern: /(John Doe|Jane Doe|Acme Corp|lorem ipsum|example\.com|TODO:|TBD|coming soon)/i,
    message: 'Sample or placeholder content detected in source.'
  },
  {
    name: 'no-brain-icons-source',
    level: 'blocker',
    excludeFile: /(\.test\.|\.spec\.|stories\.|fixtures?|mocks?)/i,
    pattern: /🧠|<Brain\b|BrainIcon|lucide-brain/i,
    message: 'Brain icons or emojis detected in source. Brain icons are considered AI slop. Remove or replace with standard icons.'
  },
  {
    name: 'no-sparkle-icons-source',
    level: 'blocker',
    excludeFile: /(\.test\.|\.spec\.|stories\.|fixtures?|mocks?)/i,
    pattern: /✨|<Sparkles\b|SparklesIcon|lucide-sparkles/i,
    message: 'Sparkle icons or emojis detected in source. Sparkle icons are considered AI slop. Remove or replace with standard icons.'
  },
  {
    name: 'no-emojis-source',
    level: 'blocker',
    excludeFile: /(\.test\.|\.spec\.|stories\.|fixtures?|mocks?)/i,
    pattern: /(?![\u00A9\u00AE\u2122])[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u,
    message: 'Emojis detected in source. Emojis are strictly forbidden in production UI code. Replace with vector icons.'
  },
  {
    name: 'sidebar-layout-risk',
    heuristic: (content, file, findings) => {
      const isSidebarFile = /sidebar/i.test(file) || /sidebar|id="sidebar"|role="complementary"/i.test(content);
      if (!isSidebarFile) return;

      const lines = content.split(/\r?\n/);

      // Check for hardcoded viewport height clipping risk (h-screen / 100vh)
      if (/h-screen|100vh|h-\[100vh\]/i.test(content) && !/h-dvh|min-h-dvh|min-h-screen/i.test(content)) {
        const lineNo = lines.findIndex(l => /h-screen|100vh|h-\[100vh\]/i.test(l)) + 1;
        findings.push({
          file,
          line: lineNo > 0 ? lineNo : 1,
          level: 'blocker',
          rule: 'sidebar-viewport-clipping',
          excerpt: 'Sidebar has hardcoded h-screen or 100vh, causing mobile bottom layout clipping. Use h-dvh, min-h-dvh, or min-h-screen.'
        });
      }

      // Check for lack of scrolling/overflow containment
      if (!/overflow-y-auto|overflow-y:\s*(auto|scroll)|overflow-y-scroll|overflow:\s*auto/i.test(content)) {
        findings.push({
          file,
          line: 1,
          level: 'blocker',
          rule: 'sidebar-missing-overflow',
          excerpt: 'Sidebar is missing explicit overflow-y scroll/containment (e.g. overflow-y-auto). Menu items may be clipped.'
        });
      }

      // Check for missing semantic active state handlers / accessibility page types
      if (!/aria-current|active-pill|\.active|activeClassName|isActive/i.test(content)) {
        findings.push({
          file,
          line: 1,
          level: 'warning',
          rule: 'sidebar-missing-active-state',
          excerpt: 'Sidebar is missing active link semantic handling (e.g., aria-current="page" or specific active class).'
        });
      }
    }
  }
];

