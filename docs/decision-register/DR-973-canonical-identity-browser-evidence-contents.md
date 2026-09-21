# DR-973: Canonical-Identity Browser Evidence Contents

## Decision

Bind local rehearsal evidence contents to the same tenant, package, unit,
launch, and student-session identity used by the storage key. Reject mixed
progression snapshots and event batches before they are merged.

## Required Invariants

- Storage version 4 includes the complete scoped identity.
- Progression identity matches the outer evidence record.
- Events preserve unit, launch, student-session, and tenant metadata identity.
- Invalid records are hidden from teacher review.
- No hosted persistence, export, assignment, or release mutation is enabled.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-local-evidence-tenant-key.mjs`
