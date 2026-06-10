Use vibe-design-md-architect in Amplify Mode.

Input:
- Old design file: [attach or paste old design.md]
- Product context: [short product description]
- Target language and direction: [Arabic RTL / English LTR / bilingual]
- Output preference: [DESIGN.amplified.md or replace DESIGN.md after preserving DESIGN.legacy.md]

Required workflow:
1. Run `npx impeccable skills install` from the project root if shell access exists.
2. Audit the old file against the skill references.
3. Preserve strong product-specific decisions.
4. Remove generic AI-looking UI patterns.
5. Produce `DESIGN.amplification-report.md`.
6. Produce the upgraded `DESIGN.amplified.md` using exactly the six required sections.
7. Validate and score the amplified file.
8. Do not start frontend implementation.
