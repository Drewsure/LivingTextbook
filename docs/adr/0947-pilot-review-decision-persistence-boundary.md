# ADR 0947: Pilot Review Decision Persistence Boundary

Status: Accepted

## Context

The platform now has one canonical review-only decision, but hosted and
closed-local deployments need a stable way to retain that review state without
coupling the contract to a backend vendor or accidentally turning a preview
decision into a launch authority.

## Decision

Define `pilot-review-decision` as a tenant-bound durable record category with
equivalent hosted and local adapter intents. The record preserves decision
status, blockers, required next steps, and evidence bindings. Every adapter
intent must explicitly preserve the decision and block activation.

The record is optional for the demo and does not unlock a pilot. Provider,
retention, school-policy, and audit acceptance remain separate gates.

## Consequences

- Provider selection can happen after the contract is stable.
- Closed publishers can use the same metadata shape without a hidden cloud
  dependency.
- Review continuity is durable by design while classroom launch, student-data
  collection, report export, approval capture, and package promotion remain
  blocked.

## Verification

- `node scripts/verify-pilot-review-decision-persistence.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
