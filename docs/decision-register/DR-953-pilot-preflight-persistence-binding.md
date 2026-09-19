# DR-953: Pilot Preflight Persistence Binding

## Decision

Controlled pilot preflight must consume the authoritative tenant-scoped
persistence status result before it can report `ready-for-review`.

## Required Invariants

- Missing persistence status remains an open preflight check.
- Only `status: healthy` with `healthy: true` passes the persistence check.
- Blocked, unauthorized, rehearsal, error, malformed, or stale results cannot
  satisfy live pilot readiness.
- The teacher panel uses the expected tenant identity for the read-only status
  request.
- `launchAllowed` and `durableWriteAllowed` remain false in every state.
- No persistence status response may expose credentials, database paths, raw
  learner audio, transcripts, or unscoped learner records.

## Evidence

- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-pilot-session-preflight-behavior.mjs`
- `scripts/verify-pilot-session-rehearsal.mjs`

