# DR-963: Persistence Provider Conformance

## Decision

Make payload-aware idempotency and cross-provider conformance a foundation hard
gate for the first production-shaped vertical slice.

## Why

The white-label platform must be able to move between rehearsal, local closed
deployment, and a future hosted provider without changing progression meaning.
An identity-only replay rule could conceal conflicting Star Dust or unlock
results. The complete progression payload must therefore be compared before a
replay is accepted.

## Consequences

- Exact retries are safe and visibly idempotent.
- Changed payloads cannot overwrite or masquerade as prior completions.
- Rehearsal and durable reads return the newest record consistently for a coded
  identity.
- SQLite restart behavior is tested without making it the universal deployment.
- Durable writes remain blocked by school, retention, release, authorization,
  and deployment policy gates.

## Evidence

`npm run verify:foundation` includes the persistence conformance check through
`scripts/verify-persistence-runtime.mjs`.
