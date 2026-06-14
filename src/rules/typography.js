import { rule } from './utils.js';

const typeScale = /type scale|typography scale|font scale|text scale|fluid type|responsive typography|typographic system/i;
const hierarchyTerms = /\b(h1|h2|h3|display|headline|title|subtitle|body|caption|label|helper text|error text|eyebrow)\b/i;
const sizeTokens = /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)|font-size|clamp\(|rem\b|px\b/i;
const responsiveTypeGuard = /clamp\(|fluid type|responsive type|mobile cap|desktop cap|type cap|breakpoint|sm:|md:|lg:|leading-|line-height/i;
const oversizedTypeRisk = /text-(6xl|7xl|8xl|9xl|\[\s*(?:5[6-9]|[6-9]\d|1\d\d)(?:px|rem)?\s*\])|font-size:\s*(?:5[6-9]|[6-9]\d|1\d\d)px|\b(?:5[6-9]|[6-9]\d|1\d\d)px\b/i;
const randomTypeLanguage = /huge heading|massive headline|big title|very large text|giant text|رزع|random size|any size/i;
const lineHeightGuard = /line-height|leading-|leading\s*:|lh-|readability|measure|characters per line|text measure/i;
const rtlTypeGuard = /arabic typography|rtl type|rtl typography|arabic line-height|mixed arabic|bilingual type|arabic font|latin font|font pairing/i;
const rtlTerms = /\b(arabic|rtl|bilingual|العربية|عربي)\b/i;

function designDoc(ctx) {
  return ctx.files['DESIGN.md'] || '';
}

export const typographyRules = [
  rule(
    'typography-scale-missing',
    'DESIGN.md needs an explicit typography scale',
    'typography-governance',
    'warning',
    'DESIGN.md',
    (ctx) => Boolean(designDoc(ctx)) && !typeScale.test(designDoc(ctx)),
    'Add a typography scale that defines display, headline, title, body, label, helper, and error text sizes instead of ad hoc text sizes.'
  ),
  rule(
    'typography-hierarchy-missing',
    'DESIGN.md needs text hierarchy roles',
    'typography-governance',
    'warning',
    'DESIGN.md',
    (ctx) => Boolean(designDoc(ctx)) && (!hierarchyTerms.test(designDoc(ctx)) || !sizeTokens.test(designDoc(ctx))),
    'Define named text roles with sizes and usage rules, such as display, h1, h2, body, label, helper text, and validation error text.'
  ),
  rule(
    'oversized-type-without-responsive-guard',
    'Large display text needs responsive sizing and line-height guards',
    'typography-governance',
    'error',
    'DESIGN.md',
    (ctx) => oversizedTypeRisk.test(designDoc(ctx)) && !responsiveTypeGuard.test(designDoc(ctx)),
    'Do not use oversized text blindly. Use clamp(...), breakpoint-specific caps, line-height rules, and mobile maximums for large headings.'
  ),
  rule(
    'random-type-sizing-language',
    'DESIGN.md contains random typography sizing language',
    'anti-ai-slop',
    'warning',
    'DESIGN.md',
    (ctx) => randomTypeLanguage.test(designDoc(ctx)) && !typeScale.test(designDoc(ctx)),
    'Replace vague size language with a real type scale and hierarchy. Headline size must follow content importance, viewport, and reading density.'
  ),
  rule(
    'typography-line-height-missing',
    'Typography scale needs line-height or readability rules',
    'typography-governance',
    'warning',
    'DESIGN.md',
    (ctx) => Boolean(designDoc(ctx)) && typeScale.test(designDoc(ctx)) && !lineHeightGuard.test(designDoc(ctx)),
    'Add line-height, text measure, and readability rules so large Arabic/English headings and dense form labels do not feel randomly sized.'
  ),
  rule(
    'rtl-typography-contract-missing',
    'Arabic or RTL interfaces need a typography contract',
    'typography-governance',
    'warning',
    'DESIGN.md',
    (ctx) => rtlTerms.test(ctx.all || designDoc(ctx)) && !rtlTypeGuard.test(designDoc(ctx)),
    'For Arabic, RTL, or bilingual interfaces, define Arabic font handling, Latin fallback, line-height, label density, and mixed-language heading behavior.'
  )
];
