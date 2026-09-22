# ADR 1076: Teacher Draft Acceptance Readiness

Status: Accepted as review-only foundation evidence

## Decision

Reconcile future school acceptance, draft ownership, retention, export, recovery, rollback, and persistence activation evidence in one provider-neutral readiness packet before any provider-specific draft writer is designed.

## Consequences

- A teacher draft cannot become durable merely because its source lineage and owner review access are valid.
- Retention, export, deletion, backup, restore, rollback, signature, and activation remain separate policy-controlled gates.
- No accepted terms, learner data export, retention deletion, rollback execution, storage activation, or assignment is enabled.

Evidence: `packages/content-model/src/teacherDraftAcceptanceReadiness.ts`, `apps/web/src/data/sampleTeacherDraftAcceptanceReadiness.ts`, and `docs/verification/TEACHER_DRAFT_ACCEPTANCE_READINESS_CHECKS.md`.
