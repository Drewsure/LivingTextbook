# ADR-0625: Source Runtime Strict Flags

Status: Accepted

## Decision

The source runtime boundary must validate upload policy, scan, lineage, rights,
extraction, OCR, draft, mapping, release, and student-use fields as actual booleans.

## Required behavior

- Source upload, scan, lineage, rights, OCR, extraction, segmentation, schema, mapping,
  package, release, raw-source, draft, AI-extraction, and student-facing-use fields must
  be booleans.
- Stringified values must produce deterministic validation errors and must not control
  PDF/DOCX/OCR intake, teacher-draft creation, student-facing use, or AI extraction.
- Raw source files remain prohibited as student payloads; rights, scan, and review gates
  remain separate from any future parser or storage adapter.

## Guardrails

This is a review-only boundary. It does not write source files, invoke OCR or parsers,
create teacher drafts, assign AI output, or enable Z.ai/game integration.

## Verification

Run `npm run verify:source-runtime`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation`.
