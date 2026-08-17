# Bounded JSX Direct-Text Analysis

## Problem

A typography rule needed to identify long literal Arabic copy on one JSX/HTML element without combining evidence across neighboring elements or counting nested child/expression content.

The previous implementation had an empty heuristic plus an order-dependent regex pattern. Because the shared scanner emits regex findings before heuristic evaluation, that pattern could produce false positives even though the actual detector logic did nothing.

## Initial assumption

An order-independent class regex plus an Arabic-character check looked sufficient.

That approach was too broad. It could not reliably enforce element-local boundaries, direct-text-only counting, nested child exclusion, multiline tags, or the 79/80-character threshold.

## Actual engineering concept

For a bounded static-analysis rule, the useful abstraction is not "parse all JSX". It is "recover only the syntactic boundaries needed by the detector contract."

The implementation therefore uses a small tokenizer that can:

- locate HTML/JSX-like opening and closing tags;
- preserve quoted attributes and brace-delimited attribute expressions while finding the end of a tag;
- skip JavaScript strings/comments when locating JSX candidates;
- treat `script` and `style` as raw-text containers;
- track nested element boundaries;
- ignore JSX expressions while collecting direct literal text;
- keep static class-token checks local to the same opening tag.

This is deliberately less ambitious than a JavaScript/TypeScript AST.

## Implementation

The detector first discovers candidate elements, then requires exact static class tokens: `leading-none` plus either `text-center` or `text-justify`.

For each candidate it extracts only direct literal text. Nested element content is skipped, JSX expressions are skipped, simple HTML entities collapse to one visible character, whitespace is removed for the threshold count, and at least one `U+0600–U+06FF` code point is required.

The finding is attached to the opening-tag line.

## Failure cases

Adversarial review found a false positive that the issue's basic acceptance list did not mention:

```js
const example = '<p className="text-center leading-none">...</p>';
```

A naive markup search treated this string as rendered JSX. The candidate locator was tightened to skip JavaScript quoted literals/comments. A similar HTML `<script>` string case was also added to the regression suite.

A second independent review exposed a parser-recovery problem with malformed or HTML-style optional markup. `collectJsxElementTags()` could collect a valid nested opening tag, fail later because an outer closing tag was missing, and then allow the caller to scan the nested tag again. That produced duplicate evidence for one source location.

The regression test deliberately added only the failing malformed-markup case first. CI reported two findings where one was expected. Candidate opening tags are now deduplicated by source start position before rule evaluation, so recovery paths cannot multiply the same evidence.

## Test proving behavior

`tests/typographyScanner.test.js` covers:

- normal and reversed class order;
- `text-center` and `text-justify`;
- exact 79/80 boundaries;
- multiline opening tags and line reporting;
- direct text split around a nested child;
- nested child exclusion;
- JSX expression exclusion, including nested object syntax;
- adjacent-element isolation;
- exact class-token matching;
- `>` inside JSX attribute expressions;
- JavaScript string false positives;
- HTML `script` raw-text false positives;
- simple HTML entity counting;
- unsupported file extensions;
- malformed outer markup without duplicate findings.

## What I should remember

A shared scanner's pre-heuristic behavior is part of every detector's contract. Do not attach a broad `pattern` merely as a cheap prefilter if the scanner automatically turns it into a finding.

When a detector only needs a narrow piece of syntax, a small bounded tokenizer can be safer than either a giant regex or a premature full parser dependency. But its unsupported dynamic cases must be documented explicitly rather than implied away.

Recovery behavior is also part of a static-analysis contract. A tolerant tokenizer may revisit malformed source, so downstream candidates need a stable identity such as source position. Recovery must never turn one physical defect into duplicate findings merely because parsing took more than one path.
