# DR-1095: Source Runtime Input Hardening

- Review-only source runtime requests now reject malformed objects and
  unsupported document, extraction, content-review, and extraction-review
  values.
- Tenant, source, target-package, and checksum inputs are bounded before a
  future PDF/text adapter can use them.
- No source file write, OCR promotion, teacher draft creation, assignment, or
  student-facing payload is enabled by this validator.

References: ADR 1095, Build session 1009, and the source runtime verifier.
