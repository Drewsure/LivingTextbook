# DR-887: Closed-Pilot Operations Boundary

The first durable progression provider now has a server-only operations
boundary for health, backup, restore, and retention deletion evidence. The
operations gate requires explicit school-policy, retention-policy, and release
approval settings. Deletion is identity-scoped and the teacher-facing status
surface is deliberately redacted.

This is operational readiness evidence, not permission to expose learner-data
export, cloud launch, public sharing, or browser mutation controls. See ADR
0815 and `docs/verification/DURABLE_PROGRESSION_OPERATIONS_CHECKS.md`.
