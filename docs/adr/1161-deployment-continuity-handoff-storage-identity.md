# ADR 1161: Deployment Continuity Handoff Storage Identity

Status: Accepted for the review-only foundation runtime

## Decision

Deployment continuity handoffs must carry the storage-selection preflight and
evidence-storage gate identity from the continuity decision and bind both IDs
in their evidence references.

## Rationale

The commercial deployment handoff is the boundary where hosted, local, and
packaged product paths become operationally discussable. Storage identity must
remain explicit there rather than being recoverable only by following an
earlier decision.

## Consequences

- Missing storage evidence bindings fail validation.
- All three deployment paths remain provider-neutral and review-only.
- Export, installation, activation, route mutation, writes, and classroom
  launch remain blocked.

## References

- `packages/content-model/src/deploymentContinuityHandoff.ts`
- `scripts/verify-deployment-continuity-handoff-storage-identity.mjs`
- `docs/adr/1160-controlled-pilot-human-review-evidence-references.md`
