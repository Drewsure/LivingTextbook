# DR-1049: Pilot Decision List Integrity

Decision: require canonical pilot blocker and required-next-step lists to be
non-empty, string-valued, and unique, with the readiness wrapper enforcing the
same blocker rule.

Required invariants:

- Blank or non-string blockers are rejected.
- Duplicate blockers are rejected.
- Blank or non-string required next steps are rejected.
- Duplicate required next steps are rejected.
- List validation does not enable persistence, reporting, promotion, or student
  access.

Evidence: `packages/content-model/src/pilotReviewDecision.ts`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`scripts/verify-pilot-review-decision-snapshot-runtime.mjs`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.
