# DR-1051: Structured Source Extraction Preview

Decision: extracted PDF/text segments must pass through a shared, tenant-bound
review-only preview contract before draft or package workflows can consume
them.

Required invariants:

- Source type, extraction method, checksum, tenant, source, and target package
  are explicit.
- Segment ids and page/sequence positions are unique and deterministic.
- Every segment maps to a declared candidate unit and contains non-blank text.
- Normalization is deterministic and does not replace the original segment text.
- Parser/OCR promotion, storage, draft creation, package assembly, route
  creation, and student-facing use remain blocked.

Evidence: `packages/content-model/src/sourceExtractionPreview.ts`,
`scripts/verify-source-extraction-preview.mjs`, and ADR 0979.
