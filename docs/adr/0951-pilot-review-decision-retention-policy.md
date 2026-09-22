# ADR 0951: Pilot Review Decision Retention Policy

Status: Accepted

## Context

The review decision snapshot and adapter are now provider-neutral and
fail-closed, but production persistence still needs explicit retention,
deletion, audit, and school-policy requirements.

## Decision

Define a tenant/package-bound retention policy contract. It names snapshot and
audit retention periods, deletion support, evidence requirements, and blocked
actions. The foundation sample remains review-only until retention, audit, and
school policy are accepted.

## Consequences

- Provider selection has a concrete policy gate to satisfy.
- Closed-local and hosted deployments can use the same policy shape.
- Valid policy shape does not authorize writes, exports, restores, activation,
  or learner-data collection.

## Verification

- `node scripts/verify-pilot-review-decision-retention-policy.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
