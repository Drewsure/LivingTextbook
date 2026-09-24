# ADR 1164: Activation Preflight Scope

Status: Accepted for the review-only foundation runtime

## Decision

Deployment continuity handoffs must carry and validate activation preflight
tenant and package scope in addition to the preflight packet ID.

## Rationale

An activation preflight ID without scope can be reused across tenant or package
boundaries. The handoff must prove that durable-write evidence belongs to the
same deployment decision under review.

## Consequences

- Activation scope drift becomes a hard blocker.
- No provider activation, persistence write, export, installation, route
  mutation, or classroom launch can follow a mismatched preflight.

## References

- `packages/content-model/src/deploymentContinuityHandoff.ts`
- `apps/web/src/data/sampleDeploymentContinuityHandoff.ts`
- `scripts/verify-deployment-continuity-handoff-storage-identity.mjs`
