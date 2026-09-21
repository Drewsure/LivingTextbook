# ADR 0912: Event Record Shape Boundary

## Decision

The shared content model and the SQLite store both validate persisted event
record shape. Route validation remains the authority for taxonomy semantics,
but storage rejects malformed categories, versions, identity fields, privacy
flags, empty event arrays, and invalid replay identity before insertion.

## Required Invariants

- The canonical completion idempotency key matches tenant, unit, launch,
  student-session, and game-mode identity.
- Raw learner audio and transcripts remain false at every persistence layer.
- A record cannot be inserted merely because it has a syntactically valid JSON
  payload.
- Read validation rechecks the stored record against the tenant-bound taxonomy.

## Evidence

- `packages/content-model/src/progressEventPersistence.ts`
- `apps/web/src/server/persistence/sqliteProgressionStore.ts`
- `scripts/verify-progress-event-persistence.mjs`
