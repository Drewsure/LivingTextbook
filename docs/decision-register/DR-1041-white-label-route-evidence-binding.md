# DR-1041: White-label Route Evidence Binding

Decision: bind route/deployment evidence to the same tenant and package as the
white-label release-readiness record.

Required invariants:

- Route evidence `tenantId` must equal readiness `tenantId`.
- Route evidence `packageId` must equal readiness `packageId`.
- Reconciled global route counts are insufficient without those identities.
- Deployment status remains `review-only`.
- Route evidence cannot authorize launch, persistence, QR mutation, offline
  delivery, installer export, or package promotion.

Evidence: `packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.
