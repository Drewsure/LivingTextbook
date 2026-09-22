# DR-1061: Composite Media-Package Readiness

## Decision

Require package-readiness reconciliation to consume the tenant-scoped content
package bound to the source assembly and validate candidate media references
inside the same composite evidence chain.

## Required invariants

- Missing, cross-tenant, missing-package, and out-of-candidate-unit media
  references fail closed before readiness evidence can pass.
- Media binding remains review-only and cannot authorize upload, rights
  approval, storage, playlist activation, promotion, assignment, or student
  access.

## Evidence

- `packages/content-model/src/packageReadinessReconciliation.ts`
- `packages/content-model/src/sourcePackageAssembly.ts`
- `apps/web/src/data/samplePackageReadinessReconciliation.ts`
- `scripts/verify-runtime-behavior.mjs`
- `docs/adr/0989-composite-media-package-readiness.md`
