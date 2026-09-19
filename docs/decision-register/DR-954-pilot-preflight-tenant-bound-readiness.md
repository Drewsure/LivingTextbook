# DR-954: Pilot Preflight Tenant-Bound Readiness

## Decision

Controlled pilot persistence readiness must be explicitly bound to the
expected tenant and durable-managed provider boundary.

## Required Invariants

- A healthy status must identify the same tenant as the pilot evidence
  envelope.
- A healthy status must declare `durable-managed` durability and a valid ISO
  check timestamp.
- Non-durable rehearsal, missing identity, mismatched identity, and malformed
  timestamps cannot pass pilot readiness.
- Changing the teacher tenant clears the previous persistence snapshot before
  the next status request resolves.
- Readiness remains review-only; launch, durable writes, activation, export,
  and release mutation remain blocked.

## Evidence

- `apps/web/src/app/api/persistence/status/route.ts`
- `apps/web/src/features/persistence/persistenceStatusClient.ts`
- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-pilot-session-preflight-behavior.mjs`

