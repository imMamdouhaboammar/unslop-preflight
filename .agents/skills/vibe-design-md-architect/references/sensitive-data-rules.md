# Sensitive Data Display Rules Reference

## Purpose

This file defines rules for displaying secrets, API keys, access tokens, refresh tokens, client secrets, webhooks, private URLs, and payment identifiers. The core problem: AI agents render sensitive data in plain text inside tables and cards, creating a security UX failure.

## Default Masking Rule

All sensitive tokens must be masked by default in any persistent UI (tables, lists, cards, detail views).

Masking pattern:

```
sk_live_••••••••••••••••••••••••••••3a7f
```

Show only:

- Prefix identifier (e.g., `sk_live_`, `pk_test_`, `whsec_`)
- Last 4 characters

The rest must be replaced with a consistent mask character (bullet `•` preferred, or asterisk `*`).

## Copy and Reveal Behavior

Required:

- Every masked token must have a copy button.
- Copy must work on the full token value, not the masked display.
- Copy action must provide visible feedback (inline checkmark or toast).
- Reveal action is optional and only for tokens that need visual inspection.
- Reveal must be temporary (auto-mask after 10-30 seconds or on blur).
- Reveal may require additional confirmation for high-sensitivity tokens.
- The reveal state must be visually distinct from the normal masked state.

Forbidden:

- Copy action with no feedback.
- Reveal that stays permanently visible.
- Reveal without a way to re-mask.

## Secure Creation Flow

When a new secret is generated (API key, token, webhook secret):

Required:

- Show the full secret once, immediately after creation, inside a secure result modal or inline reveal.
- The modal must clearly state that the secret will not be shown again.
- Provide a copy button inside the creation result.
- After the user closes the creation result, the secret must appear masked in all subsequent views.
- The creation result must not be a toast. Use a modal or inline panel.

Recommended creation flow:

1. User triggers creation (button click).
2. Loading state on the button (prevent duplicate submission).
3. Success: secure result modal opens with the full token and a copy button.
4. Modal text: "انسخ المفتاح الآن. لن يظهر مرة أخرى بعد إغلاق هذه النافذة." (or equivalent).
5. User copies and closes.
6. Token appears masked in the table.

Forbidden:

- Showing full secret in a toast only.
- Showing full secret in a table cell permanently.
- No copy feedback after creation.
- Creation result that can be dismissed accidentally (e.g., auto-dismiss toast).

## Destructive Actions on Sensitive Data

Delete, revoke, rotate, and deactivate actions on tokens and keys must require explicit confirmation.

Required:

- Destructive actions must use a confirmation modal.
- The confirmation modal must state the consequence clearly.
- For high-impact actions (revoke production key), consider requiring the user to type the key name or identifier.
- The action button must be visually distinct (error/danger styling).
- Cancel must be easy and non-destructive.
- Escape must cancel, not confirm.

Forbidden:

- Delete or revoke without confirmation.
- Destructive action triggered by a single click.
- Confirmation modals that use the same styling as success modals.

## Table Display Rules for Sensitive Data

| Column | Display | Behavior |
|---|---|---|
| Key name | Full text | Normal |
| Token value | Masked (prefix + last 4) | Copy button, optional reveal |
| Environment | Badge or label | Normal |
| Created date | Formatted date | Normal |
| Last used | Formatted date or "Never" | Normal |
| Actions | Delete, revoke, rotate | Confirmation required |

Required:

- Token column must never show full value by default.
- Action column should be sticky when horizontal scroll is active.
- Table must have internal horizontal scroll, not page scroll.

## RTL Considerations

- Token prefixes (`sk_live_`, `pk_test_`) are LTR. Wrap in `<bdi>` or use `dir="ltr"` on the token display element.
- Copy button placement follows RTL logic (inline-end of the token cell).
- Mask characters must display correctly in both directions.

## Technical references

- OWASP: secure token display practices
- WCAG 2.2: text contrast for masked and revealed states
- Material Design: data table patterns for sensitive information
