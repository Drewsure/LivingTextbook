# DR-1007: Source Assembly Language Lineage

Decision: source package assembly preserves target/support language intent and
requires policy evidence for non-English candidates.

Required invariants:

- Target language and assist languages are explicit and distinct.
- Non-English candidates carry target-language policy metadata.
- Source assembly remains review-only with all promotion and assignment flags
  blocked.

Evidence: `docs/adr/0935-source-assembly-language-lineage.md`,
`packages/content-model/src/sourcePackageAssembly.ts`, and
`apps/web/src/data/sampleSourcePackageAssembly.ts`.
