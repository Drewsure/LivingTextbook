# ADR 1074: Teacher Draft Persistence Admission

Status: Accepted as review-only foundation evidence

## Context

The source-to-draft preview now reconciles source assembly, extraction evidence, and a teacher draft identity. A future white-label product will need tenant-owned draft persistence, but a route preview must not be mistaken for permission to write content or learner data.

## Decision

Add a provider-neutral teacher draft persistence admission preflight. It defines the exact tenant, draft, source package, unit, and source-draft import identities that a future provider-specific work order must bind. It also makes private tenant visibility, teacher owner identity, source lineage, rights/audio/policy evidence, and data minimization explicit.

## Consequences

- Draft persistence can later be implemented behind the existing adapter seams without inventing a second identity model.
- Provider selection, owner authorization, retention, export, rollback, and rights evidence remain human-reviewed gates.
- No save, upload, assignment, package promotion, raw source binary, learner audio, or transcript storage is enabled by this slice.

## Evidence

- `packages/content-model/src/teacherDraftPersistencePreflight.ts`
- `apps/web/src/data/sampleTeacherDraftPersistencePreflight.ts`
- `apps/web/src/features/content-intake/TeacherDraftPersistenceAdmissionPanel.tsx`
- `docs/verification/TEACHER_DRAFT_PERSISTENCE_PREFLIGHT_CHECKS.md`
