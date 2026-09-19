# DR-956: Pilot Status Refresh

## Decision

Teacher pilot evidence surfaces must refresh tenant-scoped persistence status
read-only every minute while mounted, with cleanup and tenant-change reset.

## Required Invariants

- The refresh uses the existing tenant-scoped status endpoint.
- A previous tenant's snapshot is cleared before the next tenant request.
- Unmounted panels cannot apply a late response.
- The interval is cleared during cleanup.
- Refresh remains review-only and cannot authorize launch, writes, activation,
  export, or release mutation.

## Evidence

- `apps/web/src/features/teacher/TeacherSessionLocalEvidencePanel.tsx`
- `scripts/verify-pilot-session-rehearsal.mjs`
- `docs/adr/0884-pilot-status-refresh.md`

