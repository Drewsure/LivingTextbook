# DR-277: Source Extraction Review Packet Storage Contract

Date: 2026-07-17

## Decision

Create a backend-neutral storage contract for `source_extraction_review_packet`.

## Rationale

PDF and document onboarding is a core white-label promise, but raw extraction quality is unpredictable. A durable extraction review packet lets the platform support OCR, parser output, spreadsheet import, and AI-assisted structure proposals while preventing those outputs from becoming student-facing activities without human review and verifier gates.

## Guardrails

- Source lineage and extraction method must be preserved.
- OCR confidence and uncertain spans must be reviewable when OCR is used.
- Unit/activity/term/sentence segmentation must be reviewed.
- Candidate payloads remain draft evidence only.
- Raw PDF student payloads are blocked.
- Unreviewed OCR assignment is blocked.
- Unreviewed extraction promotion is blocked.
- Direct student assignment from extraction output is blocked.

## Verification

`npm run verify:backend-storage`, content intake checks, and `npm run verify:foundation` must pass after source extraction review packet changes.
