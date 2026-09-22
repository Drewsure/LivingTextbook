# DR-1047: White-label Pilot Evidence Binding Integrity

Decision: require pilot evidence bindings to be non-empty strings and unique
within the pilot evidence packet.

Required invariants:

- Blank or non-string bindings are rejected.
- Duplicate bindings are rejected.
- Binding validation does not enable pilot launch, reporting, persistence,
  promotion, or student access.

Evidence: `packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`scripts/verify-white-label-release-readiness-behavior.mjs`, and
`docs/WHITE_LABEL_RELEASE_READINESS_STANDARD.md`.
