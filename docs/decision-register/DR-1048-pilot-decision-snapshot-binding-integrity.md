# DR-1048: Pilot Decision Snapshot Binding Integrity

Decision: enforce duplicate and malformed evidence-binding rejection in the
canonical pilot review decision validator before snapshot rehearsal.

Required invariants:

- The source decision and release-readiness wrapper use the same binding rule.
- Provider-neutral snapshot validation rejects malformed or duplicate bindings.
- Snapshot validation remains review-only and cannot activate persistence,
  pilot launch, reporting, promotion, or student access.

Evidence: `packages/content-model/src/pilotReviewDecision.ts`,
`packages/content-model/src/pilotReviewDecisionPersistence.ts`, and
`scripts/verify-pilot-review-decision-snapshot-runtime.mjs`.
