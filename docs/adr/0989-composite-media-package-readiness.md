# ADR 0989: Composite Media-Package Readiness

## Decision

Require package-readiness reconciliation to consume the tenant-scoped content
package bound to the source assembly and validate candidate media references
inside the same composite evidence chain.

## Boundaries

- Missing, cross-tenant, missing-package, and out-of-candidate-unit media
  references fail closed.
- A passing binding is evidence only; it is not an upload, storage, rights,
  playlist, promotion, assignment, or student-activation permission.

## Rationale

Publisher source, extracted text, and multimedia form one package workflow.
The readiness chain must prove they agree before a package can be described as
coherent, even while all release side effects remain gated.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`packages/content-model/src/sourcePackageAssembly.ts`,
`apps/web/src/data/samplePackageReadinessReconciliation.ts`, and
`scripts/verify-runtime-behavior.mjs`.
