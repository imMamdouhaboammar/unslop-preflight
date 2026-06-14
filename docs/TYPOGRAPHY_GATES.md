# Typography Gates

AI-generated interfaces often fail because the agent treats typography as decoration instead of hierarchy. The result is oversized hero text, dense labels, random heading sizes, and Arabic or bilingual layouts with poor line-height.

## What the gates enforce

`DESIGN.md` should include a real typography system before implementation.

Required guidance:

- Type scale: named roles such as display, h1, h2, body, label, helper text, and error text.
- Hierarchy: which role is used where, not just raw sizes.
- Responsive guard: large headings need `clamp(...)`, breakpoint caps, or explicit mobile maximums.
- Line-height and measure: headings and dense form copy need readable rhythm.
- RTL and Arabic handling: Arabic font, Latin fallback, mixed-language heading behavior, and label density.

## What the agent must not do

- Do not choose text sizes by visual guesswork.
- Do not use very large display text without a mobile cap.
- Do not mix `text-7xl`, dense form labels, and small helper text without a hierarchy.
- Do not assume Arabic typography can reuse Latin line-height and spacing unchanged.

## Passing handoff example

```text
Typography scale: display uses clamp(40px, 6vw, 72px), h1 uses clamp(32px, 4vw, 56px), h2 32px, body 16px, label 14px, helper/error text 13px. Mobile cap: display max 44px under 390px. Line-height: display 0.95-1.05, body 1.55, Arabic labels 1.45. RTL typography: Arabic font primary with Latin fallback, mixed Arabic/English headings checked for wrapping.
```

## Related rules

- `typography-scale-missing`
- `typography-hierarchy-missing`
- `oversized-type-without-responsive-guard`
- `random-type-sizing-language`
- `typography-line-height-missing`
- `rtl-typography-contract-missing`
