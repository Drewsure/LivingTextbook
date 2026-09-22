# ADR 1078: Teacher Draft Persistence Implementation Storage Contract

## Decision

Represent teacher draft persistence implementation-readiness as its own tenant-bound durable record, adapter write intent, backend schema entity, migration candidate, and migration specification.

The record is policy-required evidence only. It preserves the acceptance-test plan and its blockers while explicitly preventing provider selection, implementation, migration, writes, uploads, route mutation, live test execution, and assignment promotion.

## Rationale

The readiness packet must survive review, export, backup, and future hosted/local comparison without being confused with a teacher draft payload or treated as an implementation authorization. A separate record makes the boundary queryable and keeps the white-label platform provider-neutral.

## Consequences

- Hosted and closed-local deployment plans share one governed readiness shape.
- The backend team has a concrete schema and migration comparison target before selecting technology.
- Readiness evidence can be retained and exported without storing learner audio or transcripts.
- No provider credentials, migration execution, upload channel, route mutation, or assignment promotion is introduced by this slice.

## References

- `packages/content-model/src/persistenceRecords.ts`
- `packages/content-model/src/persistenceAdapter.ts`
- `apps/web/src/data/sampleBackendSchemaDraft.ts`
- `apps/web/src/data/sampleBackendMigrationCandidates.ts`
- `apps/web/src/data/sampleBackendMigrationSpecs.ts`
- `docs/verification/TEACHER_DRAFT_PERSISTENCE_IMPLEMENTATION_STORAGE_CHECKS.md`
