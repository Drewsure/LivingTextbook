# ADR 1163: Deployment Handoff Source Reconciliation

Status: Accepted for the review-only foundation runtime

## Decision

Deployment continuity handoffs must be validated against the continuity
decision that produced them. The comparison includes source decision ID,
tenant, package, storage preflight, storage gate, and the source evidence
binding.

## Rationale

Handoffs may be persisted or reviewed independently from their source. Shape
validation alone cannot prove that a valid-looking packet belongs to the
current deployment decision.

## Consequences

- Stale source identity fails validation.
- The teacher panel exposes storage lineage for review.
- Export, installation, activation, route mutation, writes, and classroom
  launch remain blocked.

## References

- `packages/content-model/src/deploymentContinuityHandoff.ts`
- `scripts/verify-deployment-continuity-handoff-storage-identity.mjs`
- `docs/adr/1162-deployment-continuity-scope.md`
