# Rule Coverage Matrix

Date: 2026-08-23

Baseline commit inspected: `a56191fe22d0f8cc39ab4641cc392236e2e49973`.

Ratings describe tested/deterministic repository coverage, not breadth implied by filenames or product direction.

- **GOOD** — multiple meaningful deterministic checks with tests and useful reporting.
- **PARTIAL** — useful checks exist, but important common failure modes remain uncovered or heuristic.
- **WEAK** — only narrow/indirect signals exist.
- **NONE** — no material deterministic coverage identified during this refresh.

| Category | Coverage | Repository evidence | Main gaps / cautions |
|---|---|---|---|
| Accessibility | PARTIAL | Accessibility and source scanners cover clickable semantics, focus treatment, image/form/link patterns, dialog naming, and related handoff gates. | No complete ARIA graph, focus-order, label/control, or runtime keyboard-trap proof. |
| Responsive | PARTIAL | Responsive/source rules cover viewport-height, oversized typography, modal/sidebar/mobile risks, and overflow signals. | Static text cannot prove rendered geometry or browser-chrome interactions. |
| CSS | PARTIAL | Rules cover transition breadth, z-index escalation, hard-coded colors, overflow traps, and utility-pattern risks. | No general CSS AST or computed-style/stacking-context model. |
| Interaction | PARTIAL | Checks exist for clickable semantics, focus, controls, links, overlays, active states, and interaction guidance. | Cross-component behavior and runtime state machines remain outside static certainty. |
| React / JSX | PARTIAL | `.jsx`/`.tsx` scanning and React-shaped source rules exist; bounded markup logic supports some element-local analysis. | No repository-wide JSX AST; spreads, aliases, dynamic composition, and expression values create intentional boundaries. |
| Next.js | WEAK | General React/source rules apply to Next.js source and repair logic contains Next Image safety exclusions. | Server/client boundaries, hydration-sensitive APIs, and App Router semantics are not broadly modeled. |
| Forms | PARTIAL | Source/a11y rules cover autocomplete, button semantics, validation/accessibility patterns, and repair form scoping. | Label/control relationships and dynamic validation behavior are not comprehensively modeled. |
| Dialogs / overlays | PARTIAL | Modal/overlay, focus, clipping, overflow, viewport, scrollbar, and layering gates exist. | Actual focus trapping, clipping, stacking geometry, and offscreen controls need runtime evidence for certainty. |
| Navigation | WEAK | Link, sidebar active-state, and source navigation signals exist. The target-blank policy distinguishes modern implicit noopener from explicit `rel="opener"`. | Route correctness, invented destinations, broken links, and dynamic rel/target expressions remain incomplete. |
| Animations / transitions | PARTIAL | `transition-all`, reduced-motion, and interface-feel/motion checks provide deterministic signals. | Runtime animation cost and interaction latency are not measured by the lightweight static path. |
| Copy / prose | PARTIAL | Prose/source-slop rules detect placeholder/sample content, unwanted icon/emoji patterns, and generic generated-copy signals. | Subjective writing quality is intentionally outside deterministic certainty. |
| Performance | WEAK | Some source rules identify risky animation/render patterns. | No general bundle, render, memory, network, or INP measurement; scanner performance has no current benchmark. |
| Mobile usability | PARTIAL | Viewport units, overflow, sidebar/modal, and oversized typography signals cover common generated-code failures. | Real offscreen/unreachable controls and mobile browser chrome behavior need runtime verification. |
| RTL / Arabic typography | PARTIAL | Bounded Arabic direct-text and line-height detection has boundary/adversarial tests. | Dynamic text/classes, font metrics, bidi layout, and rendered clipping are not statically resolved. |
| Repair safety | PARTIAL | `SafetyValidator`, patch bounds, protected files, marker-based doc repair, conservative source fixes, real changed-line accounting, avatar-alt safety, and button/form scoping are covered by tests. | Issue #27 remains: per-fix detector disappearance, second-pass idempotency, and rollback are not uniformly enforced before accepting every source mutation. |
| Security / secrets | PARTIAL | Secret-risk signals, path/repair protections, safe verification commands, immutable CI action pins, and explicit-opener detection provide meaningful boundaries. | This is not a full SAST scanner; static markup cannot reason about dynamic link policies or runtime navigation state. |
| Runtime/browser verification | PARTIAL | Browser/review scanner surfaces exist and can inspect layout bounds in tests. | Runtime evidence is optional and should not be conflated with default static-scan certainty. |
| Changed-files / diff-aware scan | NONE | No implemented `scan --changed` path was verified in this refresh. | Staged, unstaged, branch-base, rename, deletion, and CI merge-base semantics need explicit design and tests. |
| Baseline/new-findings adoption | NONE | No baseline suppression/new-finding gate was verified. | Stable fingerprints and rules preventing stale baselines from hiding new defects need design. |

## 2026-08-23 policy change

The target-blank detector is a useful example of separating consequence from stylistic hardening:

- plain `target="_blank"` without explicit `noopener`/`noreferrer` is informational because modern browser behavior implies `noopener`;
- explicit `rel="opener"` is a blocker because it opts back into opener access;
- explicit `noopener`/`noreferrer` is accepted;
- removing explicit `opener` is not auto-repaired because that can change intentional cross-window behavior.

This improves trust by reducing a high-confidence false severity without abandoning the actual risky case.

## Interpretation

The product has useful breadth, but most categories remain appropriately **PARTIAL** because deterministic source analysis cannot safely infer every runtime/frontend property. Daily work should prioritize detector precision, repair safety, evidence quality, and framework applicability before simply increasing rule count.

Refresh this matrix when detector semantics, parser boundaries, runtime verification, repair architecture, or framework coverage materially change.
