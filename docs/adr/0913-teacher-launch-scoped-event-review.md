# ADR 0913: Teacher Launch-Scoped Event Review

## Decision

Add a read-only launch-scoped listing operation for teacher review of persisted
progress-event streams. The operation is available only to an already
authorized teacher, requires an explicit tenant, reviewed package, and launch
code, and returns only records that pass the tenant-bound taxonomy validator.

Student continuity reads remain exact student-session lookups. No broad tenant
listing, cross-launch query, or write capability is introduced by this slice.

## Required Invariants

- Teacher listing requires tenant, package, and launch scope.
- The tenant/package taxonomy binding is resolved before records are returned.
- Each stored record is revalidated with its pseudonymous student-session
  identity before inclusion.
- Process-memory rehearsal and SQLite durable adapters expose the same list
  contract and ordering.
- Raw learner audio and transcripts remain excluded.
- Unknown tenant/package bindings fail closed.

## Evidence

- `apps/web/src/app/api/persistence/events/route.ts`
- `apps/web/src/server/persistence/progressionPersistenceAdapter.ts`
- `apps/web/src/server/persistence/sqliteProgressionStore.ts`
- `scripts/verify-persistence-provider-conformance.mjs`
- `scripts/verify-progress-event-persistence.mjs`
