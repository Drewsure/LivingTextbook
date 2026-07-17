# 2026-07-17: Source Review Queue Verifier

## Added

- `npm run verify:source-review`.
- Foundation verification wiring for the source review queue gate.
- Checks for required extraction records, blocked extraction shortcuts, media rights blockers, teacher intake rendering, backend storage boundaries, and route verification markers.

## Rule Preserved

PDF, DOCX, OCR, parser, spreadsheet, and AI extraction outputs remain review-first evidence. They cannot create student-facing payloads, routes, games, playlists, package releases, teacher assignments, or draft packages without the reviewed handoff path.
