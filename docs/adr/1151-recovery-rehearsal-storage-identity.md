# ADR 1151: Recovery Rehearsal Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

The cross-deployment persistence recovery rehearsal must carry the exact
storage-selection preflight and evidence-storage gate identities from the
provider selection preflight. Deployment continuity decisions must reconcile
their storage identities with the recovery rehearsal before they can be
considered review-ready.

Storage remains blocked and disallowed, and recovery remains a rehearsal only.

## Rationale

Backup, restore, and export planning is downstream of storage selection
evidence. Without explicit identity on the rehearsal itself, a continuity
decision could appear complete while referring to a different provider review
packet.

## Consequences

- Hosted, local, and hybrid recovery modes share one traceable storage
  evidence lineage.
- Storage identity drift becomes a visible blocker rather than a silent review
  inconsistency.
- No backup, restore, export, provider selection, write, route mutation,
  promotion, or classroom launch is enabled by this contract.

## References

- `packages/content-model/src/persistenceRecoveryRehearsal.ts`
- `packages/content-model/src/deploymentContinuityDecision.ts`
- `apps/web/src/data/samplePersistenceRecoveryRehearsal.ts`
- `docs/adr/1150-durable-record-storage-identity.md`
