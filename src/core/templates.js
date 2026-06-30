export const productTemplate = `# PRODUCT.md

## Product Summary
[Describe the product in plain language. What is the core value proposition?]

## Target Users & Roles
- **Admin**: [Can manage users, configure settings]
- **Editor**: [Can create and edit content]
- **Viewer**: [Read-only access]

## Jobs To Be Done
- When I [context], I want to [action], so I can [benefit].

## Main Use Cases
- [Use case 1]
- [Use case 2]

## Non-Goals
- The MVP will explicitly NOT [Feature out of scope]
- We will NOT support [Platform/browser] yet.

## Data Boundaries & State Behavior
- What data is cached locally vs fetched?
- What data is strictly server-authoritative?
- Global states vs local component states:

## Core User Flows
1. [Step 1 of core flow]
2. [Step 2]

## Feature List
- [Feature 1]
- [Feature 2]

## Functional Requirements
- The system must [Requirement 1]
- The system must not [Constraint 1]

## Acceptance Criteria (Examples)
- **Given** I am logged out, **when** I visit /dashboard, **then** I am redirected to /login.
- **Given** I am an admin, **when** I click Delete, **then** a confirmation modal appears before deletion.

## Constraints
- [Technical constraint e.g., Must work without JS?]
- [Resource constraint e.g., API rate limits]

## Risk Notes
- [Known risks and mitigation strategy]

## AI-Agent Implementation Boundaries
- Inspect existing files before editing.
- Change one feature area at a time.
- Preserve existing behavior unless explicitly instructed.
- Ask for confirmation before modifying database schemas or authentication logic.
`;

export const designTemplate = `# DESIGN.md

## Design Read
Reading this as: [page kind] for [audience], with a [visual language] direction, leaning toward [design system or aesthetic family].

Use this section before implementation. Do not jump to default AI aesthetics before reading product context, audience, constraints, and references.

## Taste Controls
Set these from the brief, then let them guide layout, motion, and density decisions.

- DESIGN_VARIANCE: 6
- MOTION_INTENSITY: 4
- VISUAL_DENSITY: 4

Dial guidance:
- 1 to 3: restrained, conservative, trust-first.
- 4 to 6: balanced product design.
- 7 to 10: expressive, editorial, campaign, or experimental.

## Design System Decision
Chosen foundation: [existing system, Tailwind, shadcn/ui, Radix, Material, Fluent, Carbon, Bootstrap, GOV.UK, USWDS, bespoke CSS].

Decision rules:
- Use one design system per project.
- If an official system exists for the product context, use the official package instead of recreating it by hand.
- If the direction is only aesthetic inspiration, say so clearly and implement it with native CSS, Tailwind, or the existing component system.

## Design Principles
- Clear before clever.
- Mobile behavior must be explicit.
- Every interactive component needs loading, empty, error, disabled, hover, focus, and success states.
- Visual choices must come from the Design Read and Taste Controls, not from generic AI defaults.

## Information Architecture & Routes
- / -> Landing Page (Public)
- /login -> Auth flow (Public)
- /dashboard -> Main app (Protected, User role)
- /admin -> Management (Protected, Admin role)

## Main Screens
- **Dashboard**: [Displays key metrics, recent activity]
- **Settings**: [User profile, notification preferences]

## Component Inventory
- [Layout] Container, Sidebar, Header
- [UI] Button, Modal, Card, Input, Toast

## Responsive Behavior (Deterministic)
- Mobile under 768px: Use flex-col, w-full, and p-4 as defaults. Avoid height: 100vh. Use min-h-[100dvh].
- Tablet md 768px: Use md:grid-cols-2, md:flex-row, and md:p-6.
- Desktop lg 1024px: Use lg:grid-cols-3 and max-width containers, for example max-w-7xl mx-auto.

## Accessibility & Contrast (Deterministic)
AI models cannot visually calculate WCAG contrast. You MUST follow mathematical lightness deltas in Tailwind/CSS:
- **Light Backgrounds 50 to 200**: Text MUST be 800 to 950.
- **Dark Backgrounds 700 to 950**: Text MUST be 50 to 200 or white.
- **Mid-tones 300 to 600**: AVOID placing text on mid-tones. If necessary, use black or white and mathematically verify contrast.
- **Buttons**: Never use white text on backgrounds lighter than 600. Always explicitly define button text color.
- **Focus Management**: MUST use focus-visible:ring-2 focus-visible:ring-offset-2. NEVER use outline-none without a replacement.
- **Modals**: Must strictly trap focus, restore focus on close, and bind close to Escape key.

## Security and Privacy Display
- Never display API keys, raw tokens, or secrets in the UI. Always mask them, for example: ........
- Ensure sensitive data is handled properly before rendering.

## Interaction States (Deterministic)
- Loading: MUST use animate-pulse or an SVG spinner. Never leave the user hanging.
- Disabled: MUST use opacity-50 cursor-not-allowed pointer-events-none.
- Empty: Must display a clear message and a call-to-action button.
- Error: Must display a red warning text and a retry action.

## Form Behavior
- Validation: Validate on blur/submit.
- Error copy: Place directly under the input.
- Submission: Disable the submit button and show a loader.

## Visual Consistency Rules
- Reuse existing components before creating new ones.
- Adhere to the established color palette and typography.
- Pick a type scale before implementation and keep it consistent across sections.

## Layout Rules
- Avoid overflow: hidden as a layout bug mask. Use it intentionally for clipping only.
- Prefer CSS Grid for page structure and Flexbox for local alignment.
- Avoid complex percentage math for cards and columns.

## Anti-AI-Slop Guidelines
- Do not default to AI-purple gradients, centered dark mesh heroes, three equal feature cards, or glassmorphism everywhere.
- Never use sparkle icons or brain icons. Replace them with meaningful UI icons.
- Emojis are strictly forbidden in the UI unless the product brief explicitly requires a playful social-native tone.

## Agent Handoff
Before coding, the agent must restate the Design Read, chosen Taste Controls, design-system decision, and the screens being edited.

## Pre-flight Check
- [ ] Design Read is specific to the product, audience, and references.
- [ ] DESIGN_VARIANCE, MOTION_INTENSITY, and VISUAL_DENSITY are set from 1 to 10.
- [ ] Design-system decision is explicit.
- [ ] Responsive behavior is defined for mobile, tablet, and desktop.
- [ ] Accessibility, contrast, focus, and modal rules are defined.
- [ ] Loading, empty, error, disabled, hover, focus, and success states are covered.
- [ ] Security and privacy display rules are covered.

## Content Tone
- Clear, direct, useful.
`;

export const agentTemplate = `# Agent Instructions

## Read This First
Before coding, inspect PRODUCT.md, DESIGN.md, package.json, routing files, component structure, and any existing tests. Do not rush to implementation without understanding the existing architecture.

## Design Read and Taste Check
Before implementation, restate:
- The page kind and audience.
- The chosen visual language.
- DESIGN_VARIANCE, MOTION_INTENSITY, and VISUAL_DENSITY.
- The design-system decision.

If any of these are missing from DESIGN.md, update DESIGN.md first or stop for review.

## What Not To Change
- Do not delete existing features.
- Do not rename public routes or exported APIs without explicit approval.
- Do not replace the design system with unrelated styling.

## Security & API Key Guidelines
- Never expose API keys or secrets in client-facing code.
- If handling tokens, ensure they are masked in UI and not logged to the console.

## Regression Guard
- Preserve existing behavior.
- Limit changes to the requested scope.
- Check git diff before finalizing.
- Add or update tests when behavior changes.

## Verification Checklist (MANDATORY)
You MUST complete these steps and provide proof before considering the task done.
- [ ] App builds successfully.
- [ ] Main flows still work.
- [ ] Mobile layout checked with no horizontal overflow and proper dynamic viewport units.
- [ ] Keyboard navigation checked with Tab, Enter, Space, and Escape.
- [ ] Loading, empty, and error states implemented.
- [ ] Run npx unslop-preflight audit in the terminal.
- [ ] Paste the final score and ensure there are 0 Errors before you complete the task. Do NOT skip this step.

## When To Stop
Stop and ask for review when a change requires:
- Deleting core features.
- Changing data models or schemas.
- Altering auth/security behavior.
- Making broad redesign decisions.

## Visual & Mobile QA Checklist
- [ ] No horizontal scrolling on mobile.
- [ ] Tap targets are at least 44x44px for touch devices.
- [ ] Color contrast passes mathematical deltas.
- [ ] All forms have explicit validation boundaries and error messages.
`;

export function templateFor(file) {
  if (file === 'PRODUCT.md') return productTemplate;
  if (file === 'DESIGN.md') return designTemplate;
  if (file === 'AGENT.md' || file === 'AGENTS.md') return agentTemplate;
  return '';
}
