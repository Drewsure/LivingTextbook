# ADR 0914: Teacher Event Review Panel

## Decision

Expose the launch-scoped event review contract through the teacher session
monitor as an explicit, read-only client panel. The panel requests one
tenant/package/launch scope after teacher operations authorization, then shows
only pseudonymous learner slots and bounded summary fields.

The panel must not render raw event payloads, audio, transcripts, unrestricted
tenant results, or controls that write or mutate learner evidence.

## Required Invariants

- The client uses the teacher review access mode and same-origin credentials.
- A protected, blocked, unavailable, and empty response each has a distinct
  visible state.
- Session changes trigger a new read without granting access themselves.
- The UI does not treat an empty launch result as learner failure.
- The server remains authoritative for taxonomy validation and scope.

## Evidence

- `apps/web/src/features/persistence/HostedProgressEventReviewPanel.tsx`
- `apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts`
- `apps/web/src/app/teacher/sessions/[launchCode]/page.tsx`
- ADR 0913
