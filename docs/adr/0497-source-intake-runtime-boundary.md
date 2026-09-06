# ADR-0497: Source Intake Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral source-intake runtime request/result contract and review-only adapter in the shared content model.

## Required checks

The runtime validates tenant and package scope, checksum, upload file policy, scan, source lineage, rights, extraction method, OCR confidence, segmentation, schema, target mapping, extraction review, package approval, and teacher release before promotion.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Raw sources, unreviewed OCR/parser output, and direct AI extraction assignment cannot become student payloads.
- Teacher draft creation and student-facing use require separate review and release evidence.
- Hosted managed, local classroom, and hybrid source providers must use the same runtime contract.

## Verification

Run `npm run verify:source-runtime`, typecheck, production build, and foundation verification.
