# ADR 0985: Extraction Preview Candidate-Unit Binding

## Decision

Require each candidate unit named by a source package assembly to appear in
the assembly's tenant- and package-bound structured extraction preview.

## Boundaries

- The check validates lineage only and does not accept extracted text.
- It cannot create drafts, write storage, promote packages, create routes,
  assign learners, or activate student access.
- A preview may contain additional candidate units when a reviewer is
  narrowing a source package; the assembly may select a declared subset.

## Rationale

Package readiness must not be able to describe a unit that the source preview
never contained. The subset rule preserves legitimate reviewer narrowing while
preventing invented or cross-source unit mappings.

Evidence: `packages/content-model/src/sourcePackageAssembly.ts`,
`apps/web/src/data/sampleSourcePackageAssembly.ts`, and
`scripts/verify-runtime-behavior.mjs`.
