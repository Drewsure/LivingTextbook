# ADR 1148: Teacher Draft Persistence Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

The teacher-draft persistence implementation handoff must carry the exact
storage-selection preflight and evidence-storage gate identities already used
by the provider comparison and pilot review decision. It must remain blocked,
provider-neutral, and disallowed until policy and evidence review is complete.

## Rationale

Source intake and draft persistence are upstream of provider work. If this
handoff carries only a generic provider-preflight ID, a future adapter plan
could lose the exact storage policy lineage before a human review decision.

## Consequences

- Draft persistence planning remains traceable to storage policy evidence.
- Provider, review-decision, and teacher-draft identities must reconcile before
  implementation readiness is considered valid.
- Draft writes, media uploads, route mutation, assignment, migration, and
  student-facing promotion remain blocked.

## References

- `packages/content-model/src/teacherDraftPersistenceImplementationReadiness.ts`
- `apps/web/src/data/sampleTeacherDraftPersistenceImplementationReadiness.ts`
- `apps/web/src/features/persistence/TeacherDraftPersistenceImplementationReadinessPanel.tsx`
- `docs/adr/1147-provider-implementation-readiness-storage-identity.md`
