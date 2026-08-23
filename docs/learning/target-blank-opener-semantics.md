# `target="_blank"`, `noopener`, and detector severity

Modern HTML/browser behavior gives `target="_blank"` links implicit `noopener` semantics: the newly opened browsing context does not receive `Window.opener` by default. An explicit `rel="opener"` opts back into opener access.

For static analysis, that distinction matters more than enforcing a stylistic rel string:

- missing explicit `noopener` can be a compatibility or hardening recommendation rather than a production blocker;
- explicit `opener` is stronger evidence because the source deliberately requests cross-window opener access;
- `noopener` and `noreferrer` are not interchangeable policy mutations: `noreferrer` also affects referrer information;
- automatic removal of `opener` can change intentional application behavior, so detection can be high confidence while repair remains review-required.

The general lesson is to model platform semantics before assigning severity. A detector should block the actual failure mode, not a historical workaround that the platform now supplies implicitly.
