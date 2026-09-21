# ADR 0935: Source Assembly Language Lineage

## Decision

Source-to-package assembly packets must preserve target language, assist
languages, and an explicit target-language policy for non-English source
packages.

## Rationale

Language intent must survive structured PDF/DOCX and media intake. Otherwise a
later package or runtime could apply English assumptions to a source intended
for Japanese or another target language.

## Constraints

- Existing English source fixtures remain valid with explicit English metadata.
- Non-English source assembly fails closed without policy evidence.
- The packet remains review-only and cannot create a draft, promote a package,
  activate routes, or assign students.

## Evidence

- `packages/content-model/src/sourcePackageAssembly.ts`
- `apps/web/src/data/sampleSourcePackageAssembly.ts`
- `scripts/verify-runtime-behavior.mjs`
