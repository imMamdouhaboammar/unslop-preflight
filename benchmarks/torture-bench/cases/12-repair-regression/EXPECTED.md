Expected status: fail (before repair), improved (after)
Expected issue ids:
  - typography-scale-missing
  - modal-viewport-contract-missing
  - stacking-plan-missing
  - modal-internal-scroll-missing
Expected severity: error
Expected false positives allowed: 0
Repair regression rules:
  - Error count must decrease after autopilot
  - No NEW errors must appear after autopilot
  - Running autopilot twice must produce identical DESIGN.md (idempotency)
  - Sections injected must be specific, not generic
