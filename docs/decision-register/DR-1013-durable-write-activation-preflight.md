# DR-1013: Durable-Write Activation Preflight

Decision: expose one review-only preflight that aggregates all durable-write
activation criteria for a named tenant and package.

Required invariants:

- The preflight is blocked until student-session identity, teacher
  authorization, school policy, retention, release, operations, and named
  deployment evidence are complete.
- Passed, open, and blocked criteria remain visible independently.
- The preflight has no activation, provider mutation, learner-data write,
  school approval, or live-assignment action.
- Data minimization and hosted/local contract parity remain explicit checks.

Evidence: `docs/adr/0941-durable-write-activation-preflight.md`,
`apps/web/src/features/persistence/PersistenceActivationPreflightPanel.tsx`,
and `scripts/verify-persistence-activation-preflight.mjs`.
