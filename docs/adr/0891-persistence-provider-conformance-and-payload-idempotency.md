# ADR 0891: Persistence Provider Conformance And Payload Idempotency

## Decision

Require the process-memory rehearsal adapter and the SQLite durable adapter to
share payload-aware idempotency semantics and to pass one provider-conformance
verification gate before further persistence work is admitted.

## Context

The platform is intentionally provider-neutral while school, tenant, retention,
release, and deployment decisions remain open. Identity-only idempotency was not
strong enough: a changed progression payload using an existing key could be
silently treated as an already-accepted replay. SQLite also needed to preserve
the stored key when reading an existing row so exact replays could be recognized.

## Required Invariants

- Exact replay of the same tenant-scoped progression payload is idempotent.
- A changed payload with the same key is a visible conflict.
- Reuse of a key across tenant-scoped identities is a visible conflict.
- Reads remain tenant, package, launch, and student-session scoped.
- Reads select the newest record deterministically, including a stable key tie-breaker.
- SQLite records survive closing and reopening the store.
- The conformance check uses temporary data and cannot enable classroom writes.
- Provider conformance does not choose a hosted vendor or bypass policy gates.

## Evidence

- `apps/web/src/server/persistence/progressionRecordFingerprint.ts`
- `apps/web/src/server/persistence/progressionPersistenceAdapter.ts`
- `apps/web/src/server/persistence/sqliteProgressionStore.ts`
- `scripts/verify-persistence-provider-conformance.mjs`
- `scripts/verify-persistence-runtime.mjs`
