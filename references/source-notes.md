# Source Notes

This skill is intentionally designed around official or high-trust documentation.

## Claude Skills

Claude Agent Skills are filesystem-based packages with `SKILL.md` plus optional scripts, templates, and references. The `name` and `description` metadata help Claude decide when to load the skill. Keep `SKILL.md` concise and push detailed protocols into `references/`, `assets/`, `scripts/`, and `evals/`.

## Unslop

The mandatory setup command is:

```bash
npx unslop skills install
```

It should be attempted from the project root before creating, amplifying, or implementing UI from `DESIGN.md`.

## Accessibility

Use WCAG 2.2 AA as the practical baseline. At minimum, require contrast, focus visibility, keyboard support, target size, reflow, labels, error recovery, and reduced-motion behavior.

## RTL and Arabic

Use real document direction, not visual alignment hacks. Arabic interfaces require `dir="rtl"` or equivalent framework-level direction management plus logical CSS properties and component-level mirroring rules.

## Modern web platform

Use MDN Baseline and official framework docs to avoid relying on experimental APIs. Prefer semantic HTML, accessible in-app dialogs, responsive layout, container-aware components, and Core Web Vitals-aware implementation.

## Why the standards search gate exists

Standards and browser support change. The agent must verify live docs when web access exists, especially for any 2026-specific decision.

## Design system baselines

The first intake question selects a design system baseline. Prefer official documentation for the selected system:

- Atlassian Design System for foundations, tokens, components, and work-management patterns.
- Lightning Design System (Salesforce) for enterprise components, CRM objects, record-centric workflows, and theming.
- Polaris (Shopify) for merchant admin, commerce workflows, resource lists, and Shopify app surfaces.
- Material Design for Material 3 components, theming, layout, motion, and accessibility.
- Apple Human Interface Guidelines for Apple-platform conventions, navigation, controls, modality, and native-feeling behavior.

The baseline should guide the system. It must not be copied as a brand skin.

## Evidence base for AI UI failure patterns (2026)

The patterns in `ai-failure-patterns.md` are drawn from accessibility audits and practitioner field reports through early 2026, paraphrased and synthesized:

- Accessibility audits found AI tools routinely ship non-semantic interactive elements (clickable divs over buttons and links), missing keyboard handling, unlabeled icons, missing landmarks, and low-contrast placeholder and disabled states.
- The purple-blue gradient and single-default-font tendency traces to popular framework defaults (an indigo default accent) and tutorial repetition that entered training data, producing what Anthropic calls "distributional convergence" toward the median look.
- Production reviews repeatedly flag missing invisible states (loading, empty, error, success), placeholder and fake data that hide layout truth, hardcoded values instead of tokens, and desktop layouts merely stacked for mobile.
- Long-session reports describe spec drift within a generation and context drift across a session, plus destructive auto-fixes that change behavior or delete data.

These are cross-checked against W3C WCAG 2.2 and MDN for the corrective rules. Treat the field reports as directional evidence, not as standards; the binding rules come from WCAG, MDN, and the project's own `STANDARDS.search-notes.md`.
