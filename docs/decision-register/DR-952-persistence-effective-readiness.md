# DR-952: Persistence Effective Readiness

## Decision

The persistence status endpoint must derive `status`, `healthy`, and returned
errors from the same effective readiness set.

## Required Invariants

- Durable policy errors make the deployment blocked and not healthy.
- Provider, schema, session-boundary, operation-integrity, and policy failures
  cannot be split across contradictory status signals.
- Non-durable rehearsal remains explicitly rehearsal and does not inherit
  durable-operation policy failures as a production health claim.
- The endpoint still withholds database paths, credentials, raw audio,
  transcripts, and unscoped learner records.

## Evidence

- `apps/web/src/app/api/persistence/status/route.ts`
- `apps/web/src/features/persistence/persistenceStatusClient.ts`
- `scripts/verify-persistence-read-authorization.mjs`
