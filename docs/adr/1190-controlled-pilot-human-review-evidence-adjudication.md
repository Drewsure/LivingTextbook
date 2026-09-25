# ADR 1190: Controlled-Pilot Human-Review Evidence Adjudication

## Status

Accepted for foundation hardening.

## Decision

Add an explicit review-only adjudication record to the controlled-pilot
decision room. It binds the reviewer outcome to the decision snapshot,
release-review binding, human-review packet, readiness, tenant, and package
identities.

The only outcomes are `blocked-by-evidence` and `accepted-for-next-gate`.
The latter advances evidence for further review but does not authorize
approval or production action.

## Consequences

- Human review has an auditable next-gate result rather than an inferred status.
- Cross-tenant, stale, and scope-drifted evidence fails closed.
- Approval capture, persistence writes, release mutation, promotion, and
  student launch remain false.

## Evidence

- `packages/content-model/src/controlledPilotHumanReviewAdjudication.ts`
- `apps/web/src/features/pilot/ControlledPilotHumanReviewAdjudicationPanel.tsx`
- `scripts/verify-controlled-pilot-human-review-adjudication.mjs`
