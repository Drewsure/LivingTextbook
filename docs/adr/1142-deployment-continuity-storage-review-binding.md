# ADR 1142: Deployment Continuity Storage Review Binding

Status: Accepted for the review-only foundation runtime

## Decision

Deployment continuity decisions must carry the exact storage selection preflight
identity and evidence-storage gate from the tenant evidence handoff. The
deployment workbench may display the hosted, local, and hybrid storage review
path, but it must not select or activate a provider.

The binding remains blocked, side-effect-free, and tenant/package scoped. It
does not create storage, enable persistence, activate offline mode, mutate QR
routes, or authorize classroom launch.

## Rationale

An evidence handoff that is not visible in deployment review can become an
orphaned decision packet. Carrying the preflight and gate identities into
deployment continuity ensures a future provider work order is based on the same
review evidence used for attachments, progression persistence, and recovery.

## Consequences

- Hosted, local, and packaged deployment paths share one storage decision
  lineage.
- Provider-specific work remains a later human-approved implementation step.
- A continuity packet cannot appear ready if storage review identity drifts or
  selection is enabled.

## References

- `packages/content-model/src/deploymentContinuityDecision.ts`
- `apps/web/src/features/deployment/DeploymentContinuityDecisionPanel.tsx`
- `apps/web/src/data/sampleDeploymentContinuityDecision.ts`
