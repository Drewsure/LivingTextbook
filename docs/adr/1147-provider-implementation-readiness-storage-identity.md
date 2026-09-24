# ADR 1147: Provider Implementation Readiness Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

The provider-implementation readiness handoff must carry the exact storage
selection preflight and evidence-storage gate identities already preserved by
pilot decisions and persistence snapshots. It must remain provider-neutral,
blocked, and disallowed until separately authorized policy review.

## Rationale

Implementation readiness is the last review surface before a future provider
work order. Without explicit storage identity, a provider comparison could be
mistaken for a selected implementation or lose its tenant/package policy
lineage.

## Consequences

- Provider implementation planning remains traceable to the original storage
  policy evidence.
- Enabled or unblocked storage selection fails validation before implementation
  work can be treated as authorized.
- Hosted, closed-local, and hybrid paths remain comparable without activation,
  migration, writes, export, assignment, or classroom launch.

## References

- `packages/content-model/src/pilotReviewDecisionImplementationReadiness.ts`
- `apps/web/src/data/samplePilotReviewDecisionImplementationReadiness.ts`
- `apps/web/src/features/persistence/PilotReviewDecisionImplementationReadinessPanel.tsx`
- `docs/adr/1146-pilot-review-snapshot-storage-identity.md`
