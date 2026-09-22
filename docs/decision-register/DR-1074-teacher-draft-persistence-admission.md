# DR-1074: Teacher Draft Persistence Admission

Decision: define tenant-owned teacher draft persistence as a provider-neutral, review-only admission preflight before any future database or local-store writer.

Required invariants:

- Exact tenant, draft, source package, unit, and source-draft import identity binding.
- Private tenant visibility and teacher owner identity are explicit requirements.
- Source lineage, rights, audio, retention, export, rollback, and policy evidence remain required.
- Draft writes, assignment, promotion, raw source binary storage, learner audio, and transcript storage remain false.

Evidence: `packages/content-model/src/teacherDraftPersistencePreflight.ts` and `apps/web/src/data/sampleTeacherDraftPersistencePreflight.ts`.
