# ADR 0882: Pilot Preflight Tenant-Bound Readiness

## Status

Accepted for foundation hardening.

## Context

The pilot preflight now consumes the persistence status endpoint, but a
healthy response must not be accepted solely because its shape looks valid.
White-label review requires proof that the status belongs to the expected
tenant and represents the durable-managed provider boundary. A prior tenant's
browser state must also never remain usable while a new tenant is loading.

## Decision

The persistence status endpoint returns the authorized tenant identity and an
ISO check timestamp. Pilot preflight accepts persistence readiness only when
the snapshot is healthy, tenant-bound to the evidence envelope, explicitly
`durable-managed`, and timestamp-valid. Non-durable rehearsal, missing or
mismatched tenant identity, and malformed timestamps remain blocked or open.

The teacher evidence panel clears its prior snapshot before requesting status
for a changed tenant. This prevents a transient old-tenant healthy state from
appearing in a new white-label review.

## Consequences

- Pilot evidence cannot cross tenant boundaries through a stale or forged
  client-side readiness object.
- Non-durable rehearsal remains useful for local evidence but cannot satisfy
  controlled pilot readiness.
- Status timestamps provide an auditable check moment for later freshness
  policy without exposing infrastructure details.
- The change remains read-only and does not authorize launch, durable writes,
  activation, export, or release mutation.

## Evidence

- `apps/web/src/app/api/persistence/status/route.ts`
- `apps/web/src/features/persistence/persistenceStatusClient.ts`
- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-pilot-session-preflight-behavior.mjs`

