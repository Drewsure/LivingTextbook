# ADR 1162: Deployment Continuity Scope

Status: Accepted for the review-only foundation runtime

## Decision

Deployment continuity must reject a recovery rehearsal whose tenant or package
does not match the pilot deployment decision.

## Rationale

Recovery evidence is operationally meaningful only for the exact tenant and
package being reviewed. Independent validation of each record is insufficient
for a safe white-label handoff.

## Consequences

- Tenant and package drift becomes a hard blocked continuity decision.
- No deployment path may use a recovery rehearsal from another scope.
- Persistence activation, export, route mutation, and classroom launch remain
  blocked.

## References

- `packages/content-model/src/deploymentContinuityDecision.ts`
- `scripts/verify-deployment-continuity-scope.mjs`
- `docs/adr/1161-deployment-continuity-handoff-storage-identity.md`
