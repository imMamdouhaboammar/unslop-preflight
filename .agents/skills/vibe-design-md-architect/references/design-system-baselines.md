# Design System Baselines

## Purpose

The design system baseline is the first mandatory intake decision. It tells Claude which mature design language should inform the project's interaction model, component semantics, density, accessibility expectations, and UI behavior before any new visual system is invented.

This is not a requirement to copy another brand. It is a grounding reference. The final `DESIGN.md` must still be product-specific.

## Mandatory first intake question

If the user has not already selected a baseline, ask this as the first intake question before any other question:

> Which design system baseline should guide this project?
> 1. Atlassian Design System
> 2. Lightning Design System (Salesforce)
> 3. Polaris (Shopify)
> 4. Material Design
> 5. Human Interface Guidelines (Apple)
> 6. Custom / hybrid, with a short explanation

If the user already named a baseline in the prompt or old `DESIGN.md`, record it instead of asking again.

## Allowed values

- `atlassian`
- `salesforce-lightning`
- `shopify-polaris`
- `material-design`
- `apple-human-interface`
- `custom-hybrid`

## How to choose

### Atlassian Design System

Best for collaborative work management, admin productivity, B2B tools, issue tracking, project management, documentation-heavy apps, and products where clear workflow hierarchy matters.

Use it to influence:

- Navigation clarity
- Dense but readable work surfaces
- Status, feedback, and workflow components
- Enterprise-grade component semantics

Do not copy Atlassian colors or brand expression unless the product intentionally wants that family of cues.

### Lightning Design System (Salesforce)

Best for enterprise CRM, sales operations, B2B admin panels, record-centric workflows, approval flows, pipelines, and data-dense business tools.

Use it to influence:

- Record pages
- Tables and lists
- Form density
- Enterprise actions
- Object and entity navigation

Do not make every app look like Salesforce. Borrow the operational logic, not the brand skin.

### Polaris (Shopify)

Best for commerce, merchant tools, store admin, product management, order management, checkout-adjacent flows, business setup, and small business operations.

Use it to influence:

- Merchant-friendly language
- Admin clarity
- Commercial actions
- Resource lists
- Settings and onboarding flows

Do not use Polaris if the product has no commerce, merchant, catalog, order, or business operations context unless the user explicitly wants it.

### Material Design

Best for general-purpose web apps, Android-first products, cross-platform apps, form-heavy utilities, search experiences, and products that need a broad component vocabulary.

Use it to influence:

- Interaction states
- Component behavior
- Motion discipline
- Theming systems
- Cross-platform consistency

Do not default to Material simply because it is familiar. Choose it when its component and interaction model fits the product.

### Human Interface Guidelines (Apple)

Best for iOS, iPadOS, macOS, visionOS, Apple ecosystem apps, polished consumer tools, content creation tools, media apps, and native-feeling experiences.

Use it to influence:

- Platform conventions
- Native navigation
- Clarity and depth
- Touch ergonomics
- Permission, modal, and system feedback behavior

Do not apply Apple HIG patterns blindly to web admin tools unless the product intentionally targets Apple-like native behavior.

### Custom / hybrid

Use this when the product needs its own visual language or mixes product contexts, for example:

- Arabic-first SaaS with no Western system fit
- B2G or government-grade institutional interface
- AI tool with a specialized workflow
- Brand-led landing page
- A product with unusual interaction requirements

Custom / hybrid must still name its influences. It cannot mean no rules.

## DESIGN.md requirements

Every generated or amplified `DESIGN.md` must include:

- Selected design system baseline
- Why it was chosen
- What will be borrowed
- What must not be copied
- How the baseline is adapted to the product, brand, language, and platform
- Relevant official documentation topics checked during the standards gate

## Standards search requirements

The 2026 Standards Gate must check official documentation for the selected baseline when web access exists.

Search examples:

- Atlassian Design System foundations components official docs
- Salesforce Lightning Design System components guidelines official docs
- Shopify Polaris design system web components official docs
- Material Design 3 components theming accessibility official docs
- Apple Human Interface Guidelines components patterns official docs

## Rules

- The baseline is a source of discipline, not a visual costume.
- The agent must not copy another company's brand identity.
- The baseline must not override accessibility, RTL, responsive, or product-specific rules.
- If the user chooses a system that conflicts with the product context, Claude must state the conflict and suggest a better baseline, but still respect the user's final choice.
- If no answer is provided, Claude may choose `custom-hybrid` with documented assumptions only after asking the mandatory first question.
