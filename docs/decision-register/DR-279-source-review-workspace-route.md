# DR-279: Source Review Workspace Route

## Decision

Add a dedicated teacher source review workspace route at `/teacher/sources/[tenantId]`.

## Why

PDF/DOCX source intake, media folders, OCR/parser output, and AI extraction proposals need their own teacher/admin review boundary before any live upload or authoring controls appear. Keeping the route separate from upload, authoring, media, and assignment screens reduces the chance that source material becomes student-facing by accident.

## Guardrails

- The route is review-only.
- No live upload, OCR, parser, spreadsheet import, or AI extraction action is enabled.
- Source review displays tenant-scoped items and shared extraction-promotion rules.
- Required records remain visible before any extraction promotion.
- Raw PDFs, unreviewed OCR, parser route targets, AI extraction direct assignment, and automatic PDF-to-game publishing remain blocked.

## Verification

`npm run verify:source-review` and `npm run verify:foundation` must pass after source review route, intake, route matrix, upload, OCR/parser, or AI extraction changes.
