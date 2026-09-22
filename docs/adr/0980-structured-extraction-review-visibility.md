# ADR 0980: Structured Extraction Review Visibility

## Decision

Render the shared source extraction preview contract in the teacher source
review workspace before any real upload or extraction promotion is enabled.

The workspace must show tenant-filtered page and unit lineage, segment kind,
normalized text, original text evidence, package binding, and blocked actions.

## Boundaries

- The panel is read-only and contains no file picker, upload mutation, or
  promotion action.
- A preview is never represented as a teacher draft, package, route, storage
  record, assignment, or student payload.
- MiniStar and sample-publisher fixtures are both required to exercise the
  white-label tenant boundary.

## Rationale

Reviewers need to inspect whether a PDF/DOCX/text extraction is structurally
credible before later source gates can act on it. Visibility improves review
quality without prematurely selecting a parser, storage provider, or live
workflow.

Evidence: `apps/web/src/data/sampleSourceExtractionPreviews.ts`,
`apps/web/src/features/content-intake/SourceExtractionReviewPacketPanel.tsx`,
and `scripts/verify-source-review-queue.mjs`.
