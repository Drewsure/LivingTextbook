# ADR 1150: Durable Record Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

The durable record for teacher-draft persistence implementation readiness must
carry the exact storage-selection preflight and evidence-storage gate identities
used by the provider comparison, review readiness, and adapter write-intent
contracts.

The record remains blocked and disallowed until an explicit policy decision
authorizes storage. The shared durable-record validator rejects missing,
enabled, or incomplete storage-selection state.

## Rationale

The durable record is the last planned persistence boundary before a future
adapter could be implemented. If it contains only generic blockers, a later
implementation could lose the evidence lineage that explains why storage is
not yet authorized.

## Consequences

- Provider comparison, review readiness, write intent, and durable record now
  share a traceable storage identity.
- The persistence scaffold remains provider-neutral and review-only.
- No write, upload, migration, route mutation, assignment, or promotion is
  enabled by this record.

## References

- `packages/content-model/src/persistenceRecords.ts`
- `apps/web/src/data/samplePersistencePlan.ts`
- `scripts/verify-teacher-draft-persistence-implementation-readiness-behavior.mjs`
- `docs/adr/1149-adapter-write-intent-storage-identity.md`
