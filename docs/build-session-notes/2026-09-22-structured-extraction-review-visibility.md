# Structured Extraction Review Visibility

Date: 2026-09-22

The teacher source review workspace now renders structured extraction preview
evidence for both the MiniStar flagship tenant and the sample publisher tenant.
Reviewers can inspect page/sequence ordering, segment kind, unit/package
lineage, normalized text, and preserved original text before any later source
gate is considered.

The bridge remains read-only. It has no upload, parser, OCR, storage, draft,
package, route, assignment, or student-payload side effect. Source-review
verification now checks that this visibility cannot regress to packet-only
evidence.
