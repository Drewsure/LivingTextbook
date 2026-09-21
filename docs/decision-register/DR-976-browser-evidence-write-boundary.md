# DR-976: Browser Evidence Write Boundary

## Decision

Validate the complete v4 local evidence record inside the shared write helper,
so direct save calls cannot bypass tenant, unit, launch, student-session, and
non-blank identity checks.

## Required Invariants

- Invalid writes return without touching localStorage.
- Valid evidence remains readable through its exact scoped lookup.
- The append and direct-save paths share one validation boundary.
- No hosted persistence, export, assignment, or release mutation is enabled.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-local-evidence-runtime.mjs`
