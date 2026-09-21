# DR-1002: Package Readiness Source Lineage Binding

Decision: package readiness and its metadata-preview persistence intent must
preserve the exact SHA-256-shaped checksum of the source assembly packet they
describe.

Required invariants:

- Reconciliation scope includes both the source assembly packet id and its
  checksum.
- Hosted and local metadata previews preserve the checksum in their evidence
  lane references.
- Malformed checksums fail validation.
- Lineage evidence remains review-only and cannot authorize writes, promotion,
  assignment, route activation, or provider selection.

Evidence: `docs/adr/0930-package-readiness-source-lineage-binding.md`,
`packages/content-model/src/packageReadinessReconciliation.ts`,
`packages/content-model/src/packageReadinessPersistence.ts`, and
`scripts/verify-runtime-behavior.mjs`.
