# ADR 0277: Source Extraction Review Packet Storage Contract

Date: 2026-07-17

Status: accepted

## Context

White-label textbook partners will provide PDF, DOCX, spreadsheet, and text sources. The platform should support OCR, parser output, spreadsheet imports, and AI-assisted structure proposals, but those outputs must never become student-facing content or teacher-assignable packages without review.

## Decision

Add `source_extraction_review_packet` / `source-extraction-review-packet` as a backend-neutral storage contract.

The contract preserves source lineage, extraction method, OCR confidence, segmentation review, candidate payload summary, review status, blockers, teacher-draft creation blocks, and student-facing payload blocks.

## Consequences

- OCR, parser output, and AI extraction proposals become review evidence, not production content.
- Raw PDFs and unreviewed OCR cannot be assigned to students.
- Teacher draft creation remains blocked until source lineage, extraction quality, segmentation, schema, rights, audio plan, and verifier gates pass.
- Hosted and closed/local deployments share the same extraction-review vocabulary.
- Future OCR-to-draft or parser-to-draft workflows have a durable gate to implement against.
