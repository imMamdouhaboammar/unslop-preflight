# Unslop Torture Bench Report

**Average Score:** 3.67 / 5.0  
**Critical Misses:** 0  
**Threshold:** ❌ FAIL (< 4.0)

---

## ⚠️ 02-modal-scrollbar-slop — Score: 3/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 23 |
| Warnings found | 2 |
| Expected IDs caught | 5 / 7 |
| Missed IDs | modal-mobile-behavior-missing, modal-internal-scroll-missing |

> **Decision:** needs better ID coverage

---

## ✅ 03-random-typography — Score: 4/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 17 |
| Warnings found | 5 |
| Expected IDs caught | 4 / 4 |

> **Decision:** pass

---

## ✅ 04-z-index-panic — Score: 4/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 24 |
| Warnings found | 3 |
| Expected IDs caught | 5 / 5 |

> **Decision:** pass

---

## ✅ 05-fake-root-cause — Score: 4/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 24 |
| Warnings found | 0 |
| Expected IDs caught | 3 / 3 |

> **Decision:** pass

---

## ✅ 09-code-only-failures — Score: 4/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 25 |
| Warnings found | 5 |
| Expected IDs caught | 5 / 5 |

> **Decision:** pass

---

## ⚠️ 12-repair-regression — Score: 3/5

| Field | Value |
|---|---|
| Status correct | YES |
| Readiness | `blocked` |
| Errors found | 20 |
| Warnings found | 0 |
| Expected IDs caught | 3 / 4 |
| Missed IDs | modal-internal-scroll-missing |
| Repair idempotent | NO ❌ |

> **Decision:** needs better ID coverage

---

## Gaps & Roadmap

| Missed ID | Priority |
|---|---|
| `modal-mobile-behavior-missing` | 🟡 Normal |
| `modal-internal-scroll-missing` | 🟡 Normal |
