# DR-1045: White-label Quality Evidence Scope Display

Decision: display the tenant and package identities of quality evidence in the
release-readiness workbench.

Required invariants:

- The quality section must expose its evidence tenant.
- The quality section must expose its evidence package.
- Scope display must correspond to the validated quality evidence contract.
- Evidence display remains review-only and cannot activate release actions.

Evidence: `apps/web/src/features/release/WhiteLabelReleaseReadinessPanel.tsx`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness.mjs`.
