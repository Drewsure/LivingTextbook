# ADR 1095: Source Runtime Input Hardening

## Status

Accepted.

## Decision

The shared review-only source runtime validator must fail closed for malformed
requests before future PDF, DOCX, spreadsheet, OCR, or AI-assisted extraction
adapters can use them. It validates object shape, bounded tenant/source/package
identifiers, checksum size, and supported source type, extraction method,
content-review, and extraction-review values.

## Rationale

Textbook source intake is a high-impact boundary: a malformed or ambiguous
source record could cross tenant scope, select an unsupported parser, or be
treated as reviewed curriculum. Runtime validation is required even when the
caller is typed because future JSON, form, and adapter inputs are not protected
by TypeScript declarations.

## Guardrails

- The source runtime remains review-only and has no file write, replacement,
  OCR promotion, draft creation, assignment, or student-payload side effect.
- File policy, scan, lineage, rights, extraction, segmentation, schema,
  target-mapping, package, and teacher-release gates remain explicit.
- AI-assisted extraction remains a declared method and never bypasses human
  review or package release.
- Provider and deployment choices remain outside this validator.

See `packages/content-model/src/sourceRuntime.ts` and
`scripts/verify-runtime-behavior.mjs`.
