# DR-1052: Structured Extraction Review Visibility

Decision: expose tenant-filtered structured extraction previews in the teacher
source review workspace while preserving the review-only boundary.

Required invariants:

- Page, sequence, segment kind, unit, package, normalized text, and original
  text evidence remain visible to the reviewer.
- MiniStar and sample-publisher previews remain tenant-filtered.
- Preview state is visibly not promoted and cannot mutate drafts, packages,
  routes, storage, assignments, or student payloads.

Evidence: `apps/web/src/data/sampleSourceExtractionPreviews.ts`,
`apps/web/src/features/content-intake/SourceExtractionReviewPacketPanel.tsx`,
and `docs/adr/0980-structured-extraction-review-visibility.md`.
