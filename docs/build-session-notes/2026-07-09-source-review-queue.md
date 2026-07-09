# Build Session Note: Source Review Queue

Date: 2026-07-09

## Summary

Added a source review queue to clarify how raw PDF, DOCX, audio, video, and teacher-note inputs move toward reviewed package releases.

## Added

- `apps/web/src/data/sampleSourceReviewQueue.ts`
- `apps/web/src/features/content-intake/SourceReviewQueuePanel.tsx`
- `docs/SOURCE_REVIEW_QUEUE_CONTRACT.md`
- `docs/verification/SOURCE_REVIEW_QUEUE_CHECKS.md`
- `docs/decision-register/DR-051-source-review-queue.md`
- `docs/adr/0051-source-review-queue.md`

## Product Rule

Raw files are inputs, not student-facing truth. Reviewed package releases remain the source of truth for student routes, games, media, and reports.
