# ADR 1149: Adapter Write-Intent Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

Hosted and local teacher-draft persistence write intents must carry the exact
storage-selection preflight and evidence-storage gate identities used by the
provider comparison and teacher-draft implementation readiness handoffs.
They remain blocked and disallowed until policy review authorizes a provider.

## Rationale

Write intents are the closest persistence planning record to a future adapter.
Generic blocked flags are insufficient if a hosted or local intent can lose the
storage policy evidence it is supposed to preserve.

## Consequences

- Hosted and local plans remain traceable to the same storage policy evidence.
- Missing, enabled, or drifted storage identity fails validation before a write
  intent can be treated as implementation authorization.
- No write, upload, migration, route mutation, assignment, or promotion is
  enabled by this contract.

## References

- `packages/content-model/src/persistenceAdapter.ts`
- `apps/web/src/data/samplePersistenceAdapterPlan.ts`
- `docs/adr/1148-teacher-draft-persistence-storage-identity.md`
