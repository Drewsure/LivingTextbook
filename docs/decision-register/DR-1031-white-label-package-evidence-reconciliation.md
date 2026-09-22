# DR-1031: White-Label Package Evidence Reconciliation

Decision: bind every white-label release-readiness view to the selected
tenant package's package-readiness reconciliation and unresolved evidence
lanes.

Required invariants:

- Reconciliation identity, package identity, and source checksum must match
  the package under review.
- Lane counts and unresolved lane IDs must be internally consistent.
- Package promotion and student-facing activation remain false.
- A green quality signal or phase label cannot override unresolved package
  evidence.
- `pilot-ready` is rejected while unresolved package lanes remain, and lane
  counts must reconcile exactly.

Evidence: `docs/adr/0959-white-label-package-evidence-reconciliation.md`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness.mjs` plus
`scripts/verify-white-label-release-readiness-behavior.mjs`.
