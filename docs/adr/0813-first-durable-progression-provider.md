# ADR 0813: First durable progression provider

## Status

Accepted as the first production-shaped storage provider for the closed/local
pilot path. Hosted cloud deployment remains a separate provider-selection and
operations gate.

## Decision

Add a server-only SQLite provider behind the existing hosted progression
contract. The provider stores validated progression continuity records on disk,
uses a tenant-scoped composite key, prepared statements, WAL durability, full
synchronous writes, and idempotency-key conflict detection. The API selects it
only when `LIVING_TEXTBOOK_PERSISTENCE_PROVIDER=sqlite`.

Durable writes require all of the following:

- `LIVING_TEXTBOOK_PERSISTENCE_ALLOW_DURABLE_WRITES=true`;
- durable-managed policy mode in the request;
- explicit school/tenant policy acceptance;
- explicit retention-policy acceptance;
- release approval; and
- a server-only bearer token.

The browser must never receive the persistence token. Rehearsal mode remains
available for demos and continues to use process memory only. SQLite files are
ignored by source control and must never contain raw learner audio or learner
transcripts.

## Consequences

- The same progression route contract now has a real restart-persistent store.
- Closed/local pilots can operate without a monthly database dependency.
- A future hosted Postgres-compatible provider can replace the store without
  changing content, route, scoring, audio, or progression contracts.
- A real authentication/session service is still required before anonymous
  browser clients can write learner records directly.
- Backup, restore, encryption-at-rest, rotation, monitoring, and multi-instance
  deployment must be evidenced before this is called cloud production-ready.

## Verification

- `npm run verify:durable-persistence`
- `npm run verify:cross-route-persistence`
- web typecheck and production build
- a restart/read-back test against a temporary SQLite file
