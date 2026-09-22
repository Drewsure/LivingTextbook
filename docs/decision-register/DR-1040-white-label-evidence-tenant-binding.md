# DR-1040: White-label Evidence Tenant Binding

Decision: require package reconciliation and release-control evidence to carry
the same tenant identity as the white-label readiness record.

Required invariants:

- Package evidence `tenantId` must equal readiness `tenantId`.
- Release-control evidence `tenantId` must equal readiness `tenantId`.
- Package id equality does not replace tenant equality.
- Tenant mismatch is rejected before release readiness can be displayed as
  valid.
- Evidence remains review-only and cannot activate release actions.

Evidence: `packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.
