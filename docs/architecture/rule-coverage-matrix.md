# Rule Coverage Matrix

Date: 2026-08-17

Baseline commit inspected: `1b882bb911979977126e0354c0e84ddb61807b5b`.

Ratings describe tested/deterministic repository coverage, not the breadth implied by filenames or product direction.

- **GOOD** — multiple meaningful deterministic checks with tests and useful reporting.
- **PARTIAL** — useful checks exist, but important common failure modes remain uncovered or heuristic.
- **WEAK** — only narrow/indirect signals exist.
- **NONE** — no material deterministic coverage identified during this baseline.

| Category | Coverage | Repository evidence | Main gaps / cautions |
|---|---|---|---|
| Accessibility | PARTIAL | Accessibility scanner/script paths and source rules cover semantic interaction, focus treatment, image/form/link patterns. | No claim of complete ARIA validation, focus-order analysis, or runtime keyboard-trap detection. |
| Responsive | PARTIAL | Responsive/source rules cover viewport-height, oversized typography, modal/sidebar/mobile risk patterns. | Static text heuristics cannot prove actual viewport geometry. |
| CSS | PARTIAL | Source rules cover transition, z-index, arbitrary/hard-coded styling and related utility patterns. | No general CSS AST or computed-style model. |
| Interaction | PARTIAL | Checks exist for clickable semantics, focus treatment, controls, links, overlays, and interaction-state guidance. | Cross-component behavior and runtime state machines are not statically proven. |
| React / JSX | PARTIAL | `.jsx`/`.tsx` scanning and React-shaped source rules exist; scanners recognize common JSX patterns. | No repository-wide JSX AST; spread props, aliases, and dynamic composition create intentional boundaries. |
| Next.js | WEAK | General React/source rules may apply to Next.js files and some Next-specific safety exclusions exist in repair logic. | No broad deterministic App Router/server-client/hydration rule set was verified. |
| Forms | PARTIAL | Source/a11y rules include autocomplete, button semantics, validation/accessibility-related patterns. | Label relationships and dynamic validation behavior are not comprehensively modeled. |
| Dialogs / overlays | PARTIAL | Modal/overlay, focus, clipping, overflow, and viewport guidance exists across rules/scanners. | Runtime focus trapping, actual clipping, and stacking geometry need browser evidence for certainty. |
| Navigation | WEAK | Navigation scanner/product surfaces and link-related source checks exist. | Route correctness, invented destinations, active-state semantics, and broken-link verification are incomplete. |
| Animations / transitions | PARTIAL | `transition-all`, reduced-motion, and interface-feel/motion checks provide deterministic signals. | Runtime animation cost and interaction latency are not measured by the default static scan. |
| Copy / prose | PARTIAL | Prose/source slop rules detect placeholder/generic AI-style patterns and unwanted raw content patterns. | Subjective writing quality is intentionally outside deterministic certainty. |
| Performance | WEAK | Some source patterns identify risky animation/render choices. | No general bundle, render, memory, network, or INP measurement in the lightweight source path. |
| Mobile usability | PARTIAL | Viewport units, overflow, sidebar/modal and oversized type signals cover common generated-code failures. | Offscreen/unreachable controls and real browser chrome interactions need runtime verification. |
| RTL / Arabic typography | PARTIAL | Typography guidance exists; the 2026-08-17 branch implements bounded `long-arabic-text-height` source detection. | Dynamic class expressions, dynamic JSX text, font metrics, bidi layout, and rendered clipping are not statically resolved. |
| Repair safety | PARTIAL | `SafetyValidator`, patch limits, protected paths/lockfiles, marker-based docs repairs, conservative source fixes, and safe-command verification exist. | Source-fix post-mutation reparse/idempotency evidence is not uniformly enforced across every fixer. |
| Security / secrets | PARTIAL | Source scanning includes secret-risk signals and repair boundaries protect env/lockfiles/path traversal. | CI action pinning remains open in issue #19; this is not a full SAST/security scanner. |
| Runtime/browser verification | PARTIAL | Review/browser scanner product paths exist and the README exposes browser review flows. | Runtime evidence is not required by the default lightweight source scan and should not be conflated with static certainty. |
| Changed-files / diff-aware scan | NONE | No implemented `scan --changed` path was verified in the baseline. | Git staged/unstaged/branch/CI diff semantics need explicit design and tests. |
| Baseline/new-findings adoption | NONE | No baseline suppression/new-finding gate was verified. | Any future baseline must guarantee new defects cannot be hidden by stale fingerprints. |

## Interpretation

The current product has useful breadth, but most categories are appropriately rated PARTIAL because deterministic text scanning cannot safely infer every runtime/frontend property. Daily work should improve precision, repair safety, and evidence depth before simply increasing rule count.

The matrix must be refreshed when detectors, parser boundaries, browser verification, or repair architecture materially change.
