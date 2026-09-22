# ADR 0949: Pilot Review Decision Adapter

Status: Accepted

## Context

The snapshot contract can validate provider-neutral review continuity, but a
future hosted or closed-local implementation could still diverge if each
provider invents its own operation behavior.

## Decision

Expose validate, write, restore, and export through one review-only adapter.
Every operation returns an explicit blocked decision, proves `sideEffect:
none`, and checks expected tenant, package, and persistence mode identity.

## Consequences

- Provider implementations inherit one fail-closed operation contract.
- Browser and runtime evidence can rehearse future persistence without writes.
- Activation, student launch, reporting, and learner-data collection remain
  outside the adapter authority.

## Verification

- `node scripts/verify-pilot-review-decision-snapshot.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
