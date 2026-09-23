# ADR 1122: Observation-to-Pilot Decision Binding

## Decision

Expose a provider-neutral binding preview on the controlled pilot board. The
preview reconciles the exact browser observation handoff, adult adjudication,
and canonical pilot decision while preserving their identities.

## Boundaries

The binding is review-only. An accepted observation is accepted for pilot
review, not pilot launch. Pilot launch, learner data collection, reporting,
promotion, export, hosted persistence, and classroom access remain blocked.

## Verification

- `npm run verify:browser-rehearsal-observation-pilot-binding`
- `npm run typecheck --workspace @living-textbook/web`
- Full foundation verification before publication.
