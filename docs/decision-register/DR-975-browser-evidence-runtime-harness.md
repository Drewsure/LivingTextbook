# DR-975: Browser Evidence Runtime Harness

## Decision

Exercise browser rehearsal evidence behavior with a temporary in-memory
storage double. The runtime contract must prove valid acceptance, tenant
isolation, mixed-event rejection without mutation, and blank-identity
rejection.

## Required Invariants

- The harness never writes hosted or real learner data.
- A valid record can be read through its exact scoped lookup.
- Cross-tenant reads return no record.
- Rejected mixed events do not mutate an accepted record.
- Malformed blank-identity records are hidden.

## Evidence

- `apps/web/src/features/persistence/localSessionEvidenceStore.ts`
- `scripts/verify-local-evidence-runtime.mjs`
- `scripts/verify-foundation-composition.mjs`
