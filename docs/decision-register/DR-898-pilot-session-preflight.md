# DR-898: Pilot Session Preflight

## Decision

Add a deterministic, review-only preflight evaluator for the pilot evidence
envelope. The evaluator distinguishes a complete controlled rehearsal from a
package that is authorized for classroom launch.

## Included

- Checks for tenant/session identity, canonical stage completion,
  target-language presence, and explicit privacy exclusions.
- Stable statuses of `ready-for-review`, `incomplete`, or `invalid` with
  human-readable details for the teacher evidence panel.
- A permanently blocked launch-boundary check during this foundation phase.

## Excluded

- Classroom launch approval, assignment release, reward mutation, report
  export, live status, and durable persistence.
- Any interpretation of review readiness as production readiness.

## Evidence

- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-pilot-session-rehearsal.mjs`

See `docs/adr/0826-pilot-session-preflight.md` and
`docs/verification/PILOT_SESSION_PREFLIGHT_CHECKS.md`.
