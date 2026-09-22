# Structured Source Extraction Preview

Date: 2026-09-22

The publisher content pipeline now has a shared review-only preview boundary
for extracted PDF/text segments. It preserves tenant, source, package,
checksum, page, sequence, unit, and segment-kind lineage and derives stable
normalized text plus unit page summaries without writing files or creating
student-facing content.

The focused verifier covers valid ordering, deterministic normalization,
AI-assisted warnings, checksum rejection, duplicate page/order rejection, and
undeclared unit rejection. The preview remains blocked from parser/OCR
promotion, draft creation, storage, package assembly, routes, assignments, and
student payload use.
