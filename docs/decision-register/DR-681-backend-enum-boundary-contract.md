# DR-681: Backend Enum Boundary Contract

Status: Accepted

## Decision

Backend alignment now rejects unsupported schema entity statuses and
deployment fits, migration candidate tracks/statuses/risks, and migration
spec statuses/store kinds.

## Evidence

- Regression coverage rejects an unsupported schema status.
- Regression coverage rejects an unsupported migration candidate track.
- Regression coverage rejects an unsupported migration specification store
  kind.
- The complete backend storage readiness check remains green.
- No live storage write or vendor implementation was enabled.

This decision is recorded in
`docs/adr/0609-backend-enum-boundary-contract.md`.
