# DR-1079: Teacher Draft Persistence Runtime Regression

Status: Implemented; runtime acceptance and blocker regressions pass.

Decision: Require the shared content-model validators to accept a complete provider-neutral persistence-readiness record and adapter intent, while rejecting readiness packets that loosen provider-selection or assignment-promotion blockers.

Guardrails: The regression remains review-only. It performs no database, upload, route, migration, or assignment operation.

References: `scripts/verify-runtime-behavior.mjs`, `docs/adr/1079-teacher-draft-persistence-runtime-regression.md`, and `docs/verification/TEACHER_DRAFT_PERSISTENCE_IMPLEMENTATION_STORAGE_CHECKS.md`.
