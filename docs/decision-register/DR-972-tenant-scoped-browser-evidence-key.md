# DR-972: Tenant-Scoped Browser Evidence Key

## Decision

Scope browser rehearsal evidence storage by tenant, package, launch, and
student-session identity before reading or writing localStorage.

## Required Invariants

- The storage key contains all four identity components.
- Key parts are encoded before joining so tenant/package identifiers cannot
  alter the key structure.
- Read validation rejects a record whose embedded identity differs from the
  lookup used to retrieve it.
- Teacher review reads the same tenant/package/student-scoped lookup.
- The browser record remains rehearsal-only and cannot become hosted
  persistence, export, assignment, or release state.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-local-evidence-tenant-key.mjs`
