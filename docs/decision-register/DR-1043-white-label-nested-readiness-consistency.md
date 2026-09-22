# DR-1043: White-label Nested Readiness Consistency

Decision: a `pilot-ready` white-label readiness record must contain
non-contradictory package and pilot evidence.

Required invariants:

- Package evidence is `review-only` with zero unresolved lanes.
- Pilot evidence is `pilot-ready` with zero blocking reasons.
- Contradictory nested status is rejected even when phases and quality checks
  are green.
- This consistency check does not authorize production approval, persistence,
  package promotion, or student launch.

Evidence: `packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`scripts/verify-white-label-release-readiness-behavior.mjs`, and
`docs/adr/0971-white-label-nested-readiness-consistency.md`.
