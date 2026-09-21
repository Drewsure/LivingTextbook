# DR-974: Non-Blank Browser Evidence Identity

## Decision

Reject local rehearsal records and event entries whose canonical identity
fields are empty or whitespace-only, even when their values have string types.

## Required Invariants

- Package, tenant, unit, launch, and student-session identities are non-blank.
- Saved timestamps and progression/event identity fields are non-blank.
- Existing v4 tenant-scoped and content-bound checks remain in force.
- The boundary remains browser rehearsal only with no hosted side effects.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-local-evidence-tenant-key.mjs`
