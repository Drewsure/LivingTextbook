# DR-697: Source Runtime Strict Flags

Status: Accepted

## Decision

Source upload, scan, lineage, rights, OCR, extraction, segmentation, schema, mapping,
package, release, raw-source, draft, AI-extraction, and activation fields must use
strict boolean values at the provider-neutral boundary.

## Evidence

- The source runtime reports deterministic type errors for malformed readiness flags.
- Stringified values cannot masquerade as scan, rights, extraction, draft, release, or
  student-facing approvals.
- Runtime behavior covers malformed source flags while preserving the review-only and
  raw-source exclusion boundaries.
- No parser, OCR service, source adapter, storage write, or Z.ai integration is enabled.

This decision is recorded in `docs/adr/0625-source-runtime-strict-flags.md`.
