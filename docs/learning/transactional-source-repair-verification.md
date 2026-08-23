# Transactional Source Repair Verification

A source rewrite is not safe merely because the patch is small and deterministic. Acceptance should be transactional: produce a bounded candidate, persist it, verify the persisted bytes, and keep the mutation only when the evidence still supports it.

For Unslop source repairs, two checks complement each other:

1. **Detector disappearance**: when the triggering rule is part of the reusable modular rule set, scan the affected file again and confirm that rule no longer fires.
2. **Idempotency**: run the same bounded fixer a second time and require no further mutation.

If either check fails, restore the exact original content before reporting the repair result. This prevents a repair from being called successful when it merely changes nearby syntax without resolving the defect that justified the mutation.

Detector verification and fixer idempotency are different signals. A fixer can be idempotent while leaving the original finding intact, and a detector can disappear even when a second rewrite would still alter the file. Safe acceptance requires both where deterministic evidence is available.
