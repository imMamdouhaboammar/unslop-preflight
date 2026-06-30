# Source Slop Detectors

Unslop now includes a source-level detector layer for frontend code. The goal is to catch common AI-generated UI failures that are hard to block from `PRODUCT.md` and `DESIGN.md` alone.

Run it directly:

```bash
npx unslop scan src
```

Or run it as part of autopilot:

```bash
npx unslop autopilot
```

Skip source scanning when you only want artifact checks:

```bash
npx unslop autopilot --no-source-scan
```

## Detector categories

### Identity and reconciliation risk

- `unstable-random-key`: blocks `Math.random()` or `Date.now()` as React keys
- `array-index-key-reorder-risk`: warns on index keys that can break reordered lists

### Accessibility and interaction risk

- `outline-none-without-focus-visible`: blocks removed focus styles without a visible replacement
- `icon-only-button-review`: flags icon-only buttons for accessible-name review
- `target-blank-without-rel`: blocks external new-tab links without `noopener` or `noreferrer`

### Form and input risk

- `input-without-autocomplete-review`: checks email, password, tel, and search fields for explicit autocomplete behavior

### Layout stability risk

- `image-without-size-review`: warns when images have no obvious sizing contract
- `collection-map-empty-state-review`: warns when collection rendering lacks an obvious empty state
- `async-view-state-review`: warns when async screens need loading, error, and empty states reviewed

### Motion and visual slop risk

- `motion-without-reduced-motion-review`: warns when motion appears without reduced-motion handling
- `transition-all-animation-slop`: flags broad transition utilities
- `generic-ai-aesthetic-stack`: flags the common gradient, glass, and heavy-shadow stack for design review
- `hardcoded-color-token-drift`: warns when hex colors appear outside tokenized theme files

### Content realism risk

- `sample-data-shipping-risk`: warns when sample names, placeholder copy, or dummy domains appear in source

## Scanner behavior

Rules can run line-by-line or once across the whole file. File-scoped rules are used when the detector needs broader context, such as reduced-motion guards, empty states, and async loading/error/empty coverage.

Rules can also exclude known safe file groups. Token files, theme files, tests, stories, fixtures, and mocks can be excluded where the signal would otherwise create noisy findings.

## Severity model

- `blocker`: likely implementation, accessibility, security, or stability failure
- `warning`: likely source risk that needs review before handoff
- `info`: taste or maintainability smell that should be confirmed against the design system

## Practical use

Use source slop detectors before handing code to an AI coding agent. They should not replace tests, browser QA, or accessibility review. They give the agent a concrete fix list before it starts polishing the wrong implementation.
