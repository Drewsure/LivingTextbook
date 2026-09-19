# ADR 0883: Pilot Preflight Readiness Freshness

## Status

Accepted for foundation hardening.

## Context

Tenant-bound persistence status is necessary but insufficient if an old
healthy response remains trusted indefinitely. A teacher review tab can stay
open while deployment policy, provider health, or authorization changes.

## Decision

Pilot preflight accepts a healthy persistence snapshot only when its ISO check
timestamp is no more than five minutes old and is not from the future relative
to the evaluation time. The freshness window is represented by the shared
`PILOT_PERSISTENCE_STATUS_MAX_AGE_MS` constant and is tested with a deterministic
clock in the verifier.

Stale or future-dated status remains incomplete and cannot make a rehearsal
ready for review. The teacher panel continues to obtain status read-only; it
does not refresh through a write path or authorize classroom operation.

## Consequences

- Pilot review cannot rely on silently stale operational readiness.
- The rule is deterministic and testable without depending on wall-clock test
  timing.
- A future production UI can add a visible refresh action without changing the
  preflight contract.
- Launch, durable writes, activation, export, and release mutation remain
  blocked.

## Evidence

- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-pilot-session-preflight-behavior.mjs`
- `scripts/verify-pilot-session-rehearsal.mjs`

