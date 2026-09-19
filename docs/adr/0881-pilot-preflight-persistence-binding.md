# ADR 0881: Pilot Preflight Persistence Binding

## Status

Accepted for foundation hardening.

## Context

The controlled pilot rehearsal already assembles tenant, package, student,
workflow, target-language, privacy, and launch-boundary evidence. A complete
browser evidence envelope must not be described as pilot-ready when the
authoritative tenant-scoped persistence boundary has not been checked.

## Decision

Bind the teacher pilot-session preflight to the authoritative persistence
status result for the expected tenant. The preflight adds a persistence check
that is open until a status snapshot is supplied, passes only when the status
is explicitly `healthy` with `healthy: true`, and blocks for every other state.

The preflight remains review-only: `launchAllowed` and
`durableWriteAllowed` are permanently false. A healthy status is evidence for
human review, not permission to activate a classroom, write learner data, or
change release state.

## Consequences

- Teacher review has one authoritative persistence signal instead of inferred
  readiness from browser evidence alone.
- Rehearsal and durable deployment states remain distinguishable.
- Missing, blocked, unauthorized, rehearsal, error, or stale status cannot be
  presented as pilot-ready.
- The browser panel performs a read-only status request and exposes no server
  implementation details or learner records.

## Evidence

- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `apps/web/src/features/persistence/persistenceStatusClient.ts`
- `scripts/verify-pilot-session-preflight-behavior.mjs`
- `scripts/verify-pilot-session-rehearsal.mjs`

