# ADR 0952: Provider-Neutral Implementation Readiness

Status: Accepted

## Context

The platform now has separate contracts for review decisions, snapshots,
adapters, and retention policy. A provider implementation still needs one
decision boundary that reconciles those records without accidentally opening
production writes.

## Decision

Use a tenant/package-bound implementation-readiness handoff. It reports the
validity and acceptance state of the persistence evidence, names blocked
actions and next steps, and keeps provider selection and implementation
blocked in the foundation sample.

## Consequences

- Hosted and closed-local provider work can be compared against one contract.
- Human policy acceptance remains visible and auditable.
- Valid handoff shape never authorizes writes, restore, export, activation, or
  learner-data collection.

## Verification

- `node scripts/verify-pilot-review-decision-implementation-readiness.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
