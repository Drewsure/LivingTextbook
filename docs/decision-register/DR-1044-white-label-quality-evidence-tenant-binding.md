# DR-1044: White-label Quality Evidence Tenant and Package Binding

Decision: require every quality evidence record to carry the same tenant and
package identities as the white-label readiness record.

Required invariants:

- Quality evidence `tenantId` must equal readiness `tenantId`.
- Quality evidence `packageId` must equal readiness `packageId`.
- A green quality result from another tenant or package is invalid.
- Identity mismatch is rejected before readiness can be treated as valid.
- Quality evidence remains review-only and cannot activate release actions.

Evidence: `packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.
