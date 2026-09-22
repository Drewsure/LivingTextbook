# DR-1078: Teacher Draft Persistence Implementation Storage Contract

Status: Implemented as policy-required, provider-neutral storage evidence; no persistence provider or live write path is enabled.

Decision: Store the implementation-readiness packet as a dedicated tenant-bound record and mirror it in the hosted/local adapter, schema, migration candidate, and migration specification plans.

Guardrails: The nine acceptance tests remain required. Provider selection, implementation, migration, live writes, uploads, route mutation, live test execution, assignment promotion, provider credentials, raw learner audio, and learner transcripts remain blocked.

References: `packages/content-model/src/persistenceRecords.ts`, `packages/content-model/src/persistenceAdapter.ts`, `apps/web/src/data/sampleBackendSchemaDraft.ts`, `apps/web/src/data/sampleBackendMigrationCandidates.ts`, `apps/web/src/data/sampleBackendMigrationSpecs.ts`, and `docs/verification/TEACHER_DRAFT_PERSISTENCE_IMPLEMENTATION_STORAGE_CHECKS.md`.
