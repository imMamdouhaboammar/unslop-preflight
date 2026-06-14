# Unslop Torture Bench Report

**Average Score:** 3.00 / 5.0  
**Critical Misses:** 3  
**Threshold:** ❌ FAIL (< 4.0)

---

## ❌ 02-modal-scrollbar-slop — Score: 2/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 22 |
| Warnings found | 2 |
| Expected IDs caught | 2 / 7 |
| Missed IDs | modal-scrollbar-aesthetic-missing, modal-mobile-behavior-missing, blind-z-index-escalation, oversized-typography-mobile-risk, modal-internal-scroll-risk |

> **Decision:** needs source scanner improvement

---

## ⚠️ 03-random-typography — Score: 3/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 15 |
| Warnings found | 5 |
| Expected IDs caught | 3 / 4 |
| Missed IDs | random-type-sizing-language |

> **Decision:** needs better report / rule tuning

---

## ✅ 04-z-index-panic — Score: 4/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 23 |
| Warnings found | 3 |
| Expected IDs caught | 4 / 4 |

> **Decision:** pass

---

## ❌ 05-fake-root-cause — Score: 2/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 19 |
| Warnings found | 0 |
| Expected IDs caught | 0 / 2 |
| Missed IDs | root-cause-mode-missing, symptom-patch-language |

> **Decision:** needs better report / rule tuning

---

## ✅ 09-code-only-failures — Score: 4/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 24 |
| Warnings found | 5 |
| Expected IDs caught | 5 / 5 |

> **Decision:** pass

---

## ⚠️ 12-repair-regression — Score: 3/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 19 |
| Warnings found | 0 |
| Expected IDs caught | 4 / 8 |
| Missed IDs | Error, No, Running, Sections |
| Repair idempotent | YES |

> **Decision:** needs better report / rule tuning

---

## Gaps Identified

These expected issue IDs were NOT detected across all cases:

- `modal-scrollbar-aesthetic-missing`
- `modal-mobile-behavior-missing`
- `blind-z-index-escalation`
- `oversized-typography-mobile-risk`
- `modal-internal-scroll-risk`
- `random-type-sizing-language`
- `root-cause-mode-missing`
- `symptom-patch-language`
- `Error`
- `No`
- `Running`
- `Sections`

## Rule Coverage Roadmap

Rules that exist as expected IDs but lack implementation should be added to the roadmap:

- [ ] `modal-scrollbar-aesthetic-missing`
- [ ] `modal-mobile-behavior-missing`
- [ ] `blind-z-index-escalation`
- [ ] `oversized-typography-mobile-risk`
- [ ] `modal-internal-scroll-risk`
- [ ] `random-type-sizing-language`
- [ ] `root-cause-mode-missing`
- [ ] `symptom-patch-language`
- [ ] `Error`
- [ ] `No`
- [ ] `Running`
- [ ] `Sections`
