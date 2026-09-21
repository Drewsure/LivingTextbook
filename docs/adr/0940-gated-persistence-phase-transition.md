# ADR-0940: Gated Persistence Phase Transition

Status: Accepted for foundation hardening

## Decision

Move the platform from the completed local progression checkpoint into a
gated persistence phase. Keep process-memory as the default rehearsal path and
use the server-only SQLite adapter as the reference durable implementation for
conformance, recovery, and deployment rehearsal. Neither path may accept live
learner data until the deployment gate is explicitly satisfied.

## Required invariants

- A successful build or readiness preview never activates durable writes.
- Process-memory is labelled `non-durable-rehearsal` and is suitable for local
  demonstration only.
- SQLite is labelled `durable-managed`, remains server-only, and is available
  for controlled deployment rehearsal rather than automatic production use.
- Durable activation requires signed student-session boundaries, tenant-scoped
  teacher authorization, school policy, retention policy, release approval,
  operations readiness, and deployment configuration.
- Status and evidence surfaces must not expose secrets, database paths, learner
  records, raw audio, or transcripts.
- Hosted and local companion deployments must preserve provider-neutral event,
  report, recovery, and export contracts.

## Consequence

The team can now test persistence behavior and reporting boundaries without
pretending that a production backend has been selected or approved. This keeps
the white-label product adaptable, limits cost, and gives the first pilot a
clear activation checklist.

Evidence: `apps/web/src/server/persistence/progressionPersistenceAdapter.ts`,
`apps/web/src/server/persistence/sqliteProgressionStore.ts`,
`apps/web/src/app/api/persistence/status/route.ts`, and
`apps/web/src/features/persistence/HostedProgressionAdapterPanel.tsx`.
