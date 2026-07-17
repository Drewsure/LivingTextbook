# DR-281: Source Extraction Review Packet Preview

## Decision

Show source extraction review packet previews inside teacher source review workspaces.

## Why

The backend contract already names `source_extraction_review_packet`, but teachers and partner reviewers need to see what those packets contain before live OCR, parser, spreadsheet, or AI extraction features exist. A visible packet preview makes extraction review concrete while keeping promotion blocked.

## Guardrails

- Extraction packets remain evidence only.
- Teacher draft creation is blocked from extraction packets.
- Student-facing payload creation is blocked from extraction packets.
- Playlist creation and media-only progress are blocked from media extraction packets.
- Package release requires verifier handoff and release gates.

## Verification

`npm run verify:source-review` and `npm run verify:foundation` must pass after extraction packet data, source review workspace, OCR/parser, AI indexing, media review, or package handoff changes.
