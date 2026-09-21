# DR-1003: Package Readiness Source Binding Validation

Decision: package-readiness reconciliation must be validated directly against
the source assembly record it names, not only against its own field shape.

Required invariants:

- Tenant and target package scope must match.
- Packet id and source checksum must match exactly.
- Missing or mismatched binding fields fail closed.
- The comparison is review evidence only and cannot enable writes, promotion,
  route activation, or student assignment.

Evidence: `docs/adr/0931-package-readiness-source-binding-validation.md`,
`packages/content-model/src/packageReadinessReconciliation.ts`,
`apps/web/src/data/samplePackageReadinessReconciliation.ts`, and
`scripts/verify-runtime-behavior.mjs`.
