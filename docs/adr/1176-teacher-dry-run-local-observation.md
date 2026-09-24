# ADR 1176: Teacher Dry-Run Local Observation

## Decision

The teacher dry-run workspace records its own review receipt through the shared browser rehearsal observation contract, using a deterministic synthetic session identity:

`teacher-dry-run:<rehearsal-id>`

The receipt is browser-local and review-only. It must not be interpreted as learner activity, a classroom record, hosted persistence, report export, pilot approval, or production launch permission.

## Rationale

The existing teacher session evidence surface correctly requires an actual local student-session event record. A dry run has no learner session and should not fabricate one. A separate dry-run receipt lets an adult confirm the route checklist and preserves a clean boundary between teacher rehearsal evidence and learner evidence.

## Guardrails

- Tenant, package, launch, unit, and synthetic session identity are validated by the shared observation store.
- Route and check identifiers are deterministic and scoped to the rehearsal.
- No API call, hosted write, report export, assignment, QR mutation, or approval action is introduced.
- The receipt remains review-only with production launch and release promotion permanently false.

## Evidence

`apps/web/src/features/pilot/TeacherDryRunObservationPanel.tsx`

`apps/web/src/data/sampleTeacherDryRunRehearsal.ts`

`scripts/verify-teacher-dry-run-observation.mjs`
