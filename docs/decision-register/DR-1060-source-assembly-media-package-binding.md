# DR-1060: Source Assembly Media-Package Binding

## Decision

Require candidate media asset IDs in a source package assembly to resolve to
the same tenant- and package-scoped content package before readiness evidence
can consume those references.

## Required invariants

- Every candidate media ID must exist in the bound content package.
- Media tenant identity must match the assembly tenant.
- Unit-bound media must remain inside the assembly's candidate-unit scope.
- The binding remains review-only and cannot authorize upload, rights approval,
  storage, playlist activation, promotion, assignment, or student access.

## Evidence

- `packages/content-model/src/sourcePackageAssembly.ts`
- `apps/web/src/data/sampleSourcePackageAssembly.ts`
- `scripts/verify-runtime-behavior.mjs`
- `docs/adr/0988-source-assembly-media-package-binding.md`
