# DR-278: Source Review Queue Verifier

## Decision

Add a focused verifier for the source review queue and include it in the foundation verification command.

## Why

PDF/DOCX onboarding, media upload, OCR, parser output, spreadsheet import, and AI extraction are central to the white-label product promise. They are also risky if they quietly become a shortcut into student-facing games. A focused verifier keeps the required review records and blocked shortcuts visible as the build grows.

## Guardrails

- Source files remain preserved source material, not canonical student payloads.
- Extraction review packets remain evidence only.
- Media sources require rights review before pilot use.
- Support-language text remains support only and cannot unlock progression.
- Source review must name the required handoff records before extraction promotion.
- Raw PDFs, unreviewed OCR, direct AI extraction assignment, parser route targets, and automatic PDF-to-game publishing stay blocked.

## Verification

`npm run verify:source-review` and `npm run verify:foundation` must pass after source review queue, PDF/DOCX intake, OCR/parser, AI extraction, upload policy, media review, or teacher draft handoff changes.
