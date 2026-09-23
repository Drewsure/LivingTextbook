# ADR 1108: Cross-Deployment Persistence Recovery Rehearsal

Status: Accepted for the review-only foundation runtime

## Decision

Use one provider-neutral rehearsal contract to compare hosted-managed,
closed-local, and hybrid persistence recovery paths. The contract binds the
provider-selection preflight, persistence handoff, and local recovery evidence
to the same tenant and package scope.

The rehearsal requires evidence for backup, restore, export, retention,
rollback, tenant isolation, and learner-data exclusions. It never selects a
provider or enables writes, backup creation, restore execution, export,
package promotion, or route mutation.

## Rationale

White-label publishers may need different deployment models, but the platform
must not fork its continuity rules or become locked to the first provider
chosen. A shared rehearsal exposes cost and operational gaps while the system
is still safe to change.

## Consequences

- Hosted, local, and hybrid reviews use one auditable shape.
- Open recovery evidence remains visible to teachers and publishers.
- A later provider-specific work order must satisfy this rehearsal before live
  persistence or recovery can be considered.

## References

- `packages/content-model/src/persistenceRecoveryRehearsal.ts`
- `apps/web/src/features/persistence/PersistenceRecoveryRehearsalPanel.tsx`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
