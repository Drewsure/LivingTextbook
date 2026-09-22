# ADR 0987: Extraction-Preview Output Invariants

## Decision

Revalidate the structured extraction preview object after creation and before
later source, package, or readiness evidence consumes it.

## Boundaries

- Original text remains preserved for review; normalization is deterministic
  and derived only.
- Summary counts and page ranges must match the preview's segments.
- Composite package-readiness lineage must invoke this validator before it
  accepts the preview as evidence.
- The validator authorizes no extraction acceptance, storage, promotion, route,
  assignment, or student access.

## Rationale

Request validation protects the input boundary, but a transformed preview is a
second contract. Validating both boundaries prevents later mutation or mapping
drift from becoming apparently trustworthy evidence.

Evidence: `packages/content-model/src/sourceExtractionPreview.ts`,
`scripts/verify-source-extraction-preview.mjs`, and
`scripts/verify-source-review-queue.mjs`.
