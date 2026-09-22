# DR-1054: Package-Readiness Extraction Lineage

Decision: package-readiness reconciliation and its provider-neutral metadata
preview must preserve the exact structured extraction preview identity behind
source assembly evidence.

Required invariants:

- Tenant, package assembly, extraction preview identity, and source checksum
  must match before reconciliation is valid.
- Preview-ID drift fails closed in source binding verification.
- Reconciliation remains review-only and cannot promote, assign, write routes
  or playlists, or activate student access.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`packages/content-model/src/packageReadinessPersistence.ts`, and
`docs/adr/0982-package-readiness-extraction-lineage.md`.
