# ADR 0946: Canonical Teacher Review Decision

Status: Accepted

## Context

The platform had several accurate but separate readiness panels. A teacher or
publisher could inspect each one, but no single contract reconciled the
canonical pilot handoff, evidence handoff, release-control state, approvals,
persistence, reporting, and activation preflight.

## Decision

Add a shared `PilotReviewDecision` contract and a teacher-visible decision
panel. The sample decision derives its blockers and next steps from the
canonical handoff and evidence packet. It allows a controlled demonstration
while keeping classroom launch, real learner-data collection, report export,
package promotion, and live actions blocked.

## Consequences

- Partner conversations have one plain-language answer without weakening any
  underlying gate.
- The decision can become a durable record after identity, storage, policy, and
  audit requirements are accepted.
- Z.ai/Phaser work remains outside this decision until the canonical game
  integration gates are passed.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:foundation-composition`
- `npm run verify:routes`
