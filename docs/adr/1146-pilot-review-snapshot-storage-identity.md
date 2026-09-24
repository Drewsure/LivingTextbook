# ADR 1146: Pilot Review Snapshot Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

Provider-neutral pilot review decision snapshots must carry the exact storage
selection preflight and evidence-storage gate identities at snapshot level,
not only inside the embedded decision. Snapshot validation must require those
identities to match the embedded decision and preserve blocked status.

## Rationale

Durable records, recovery rehearsals, and audits need an explicit identity
chain. Requiring reviewers to inspect a nested decision creates an avoidable
ambiguity at the persistence boundary and makes future migrations easier to
mis-bind.

## Consequences

- Hosted-managed and local-classroom snapshots remain structurally aligned.
- Storage identity drift fails validation before restore, export, or any future
  provider work order can be considered.
- Snapshots remain review-only: no write, restore, export, activation, learner
  data, or provider selection is authorized.

## References

- `packages/content-model/src/pilotReviewDecisionPersistence.ts`
- `apps/web/src/features/persistence/PilotReviewDecisionPersistenceSnapshotPanel.tsx`
- `docs/adr/1145-pilot-decision-storage-identity.md`
