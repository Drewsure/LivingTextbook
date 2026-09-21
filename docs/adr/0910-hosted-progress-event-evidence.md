# ADR 0910: Hosted Progress Event Evidence

## Decision

The first hosted persistence adapter stores completed canonical game event
evidence in a separate tenant-scoped `progress-event-stream` record alongside
progression continuity. The record is append-only at the attempt level,
idempotent on the canonical completion identity, and remains disabled unless
deployment policy and authorization gates explicitly permit the write.

## Required Invariants

- Every persisted stream is bound to tenant, package, launch, and pseudonymous
  student-session identity.
- The stream must pass the shared taxonomy and chronological event validator,
  and must contain `game_started` and `game_completed`.
- Replayed completion writes return the existing record; changed payloads or
  cross-tenant idempotency reuse are conflicts.
- Raw learner audio and learner transcripts are never persistence fields.
- Student reads require a matching learner session; teacher reads require a
  tenant-scoped operations session.
- Rehearsal and durable writes remain separate policy modes. No live write is
  enabled by this contract alone.

## Scope

This is a persistence contract and server adapter slice, not a production
deployment approval. The event taxonomy remains server-owned for the current
sample tenants and must become package/tenant-resolved before a real publisher
pilot.

## Evidence

- `packages/content-model/src/progressEventPersistence.ts`
- `apps/web/src/server/persistence/sqliteProgressionStore.ts`
- `apps/web/src/server/persistence/progressionPersistenceAdapter.ts`
- `apps/web/src/app/api/persistence/events/route.ts`
- `scripts/verify-progress-event-persistence.mjs`
