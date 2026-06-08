# Anti-AI UI Slop Reference

## Purpose

This file defines visible patterns that often make AI-generated interfaces feel generic, disposable, or unserious.

Use it before creating `DESIGN.md`, before implementing UI, and during review.

## Common surface-level signs

Avoid these unless they are explicitly justified by product context:

1. Purple or blue gradient as the default brand identity.
2. Gradient headline text.
3. Floating glass cards without interaction purpose.
4. Excessive shadows on every card.
5. Same 16px or 24px spacing everywhere.
6. Identical feature cards repeated across the page.
7. Icons above every feature title.
8. Large rounded cards with no density control.
9. Fake metrics that do not connect to product proof.
10. Tiny eyebrow labels before every section.
11. Abstract blobs, sparkles, starfields, particles, or halos.
12. Generic AI robot visuals.
13. Overuse of “AI-powered”, “smart”, “automated”, and “modern”.
14. Too many nested containers.
15. Low contrast secondary text.
16. Placeholder avatars and placeholder screenshots.
17. Motion that exists only because the agent can animate.

## Deeper signs

The deeper problem is lack of intent.

A design feels AI-made when:

- The visual style does not match the user situation.
- The first screen explains nothing concrete.
- Components do not express product hierarchy.
- Typography has no editorial system.
- Empty states are decorative instead of useful.
- Forms do not guide recovery.
- Charts look decorative rather than decision-useful.
- Mobile layout is just the desktop stacked vertically.
- RTL is treated as text alignment only.

## Replacement principles

Instead of generic style, define:

- Product scene: where the product lives in the user's day.
- User tension: what pressure the product relieves.
- Visual metaphor: command room, notebook, cockpit, ledger, studio, field kit, private desk.
- Density level: calm, compact, operator-grade, editorial, immersive.
- Interaction tone: quiet, precise, fast, advisory, guided, assertive.
- Proof style: screenshots, logs, records, timelines, comparisons, annotations.

## Review questions

Ask:

- Could this screen belong to 50 other startups?
- Does the hero say anything only this product can say?
- Does each component have a job?
- Is there any decoration pretending to be design?
- Would a serious user trust this interface with money, work, or client data?
- Is the design still clear without animation?
- Does the mobile version have its own rhythm?


## Additional hard failures

Treat these as hard failures during review:

1. Weak contrast hidden behind pretty colors.
2. Dominant AI-looking gradients that are not connected to the product context.
3. Sparkle, magic wand, starburst, glitter, bot, and generic AI icons used as default visual language.
4. Emojis used instead of a controlled icon system.
5. Arabic UI that is only text-aligned right but not structurally RTL.
6. English UI that mixes left and right alignment without a content reason.
7. UX screens built by stacking cards instead of following task logic.
8. Mobile screens that are just desktop content stacked vertically.
9. Native browser popups used for confirmation, deletion, errors, or onboarding.
10. Interfaces that ignore 2026 expectations around semantic HTML, accessibility, responsive behavior, keyboard use, reduced motion, and meaningful in-app feedback.

## Review questions for the added failures

- Does every foreground and background pair pass the intended contrast rule?
- Does the palette look selected for this product, or selected from an AI SaaS default?
- Could the icon system survive without sparkle, magic, robot, or emoji shortcuts?
- Is the entire shell directionally correct, not just the text?
- Does each block support a task, a decision, or a conversion moment?
- Does mobile have its own hierarchy, navigation pattern, and interaction rhythm?
- Are destructive, blocking, or important actions handled through designed in-app UI rather than native browser popups?
