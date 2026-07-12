# Printable Output Readiness Contract

Document type: foundation product contract

Related:

- `docs/ACTIVITY_PATHWAY_COMPATIBILITY_MATRIX.md`
- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/UNIT_GAME_OFFER_MAP_CONTRACT.md`
- `docs/verification/PRINTABLE_WORKSHEET_ROUTE_CHECKS.md`

## Purpose

Printable activities are a planned platform capability, not a quick export button.

The platform should generate printables from reviewed content package data so teacher handouts, homework, workbook companions, and low-device classroom activities stay aligned with the digital unit.

## Current Sample

Sample data:

- `apps/web/src/data/samplePrintableOutputPlan.ts`

Panel:

- `apps/web/src/features/content-intake/PrintableOutputReadinessPanel.tsx`

Route:

- `/teacher/intake`
- `/print/demo-unit-1`
- `/print/partner-demo-unit-1`

Verifier:

- `npm run verify:printables`

## Current Outputs

Ready browser-print previews:

- Vocabulary listening sheet
- Sentence practice worksheet

Planned:

- Teacher answer key

Blocked:

- Word Search printable
- Crossword printable

## Export Rule

PDF export is blocked until:

- QR/audio bridge exists,
- package version and rights snapshot exist,
- teacher export/access policy exists,
- printable output is tied to reviewed package data,
- hosted and local companion route behavior is clear.

## Standing Rules

- Printables must not drift from reviewed package content.
- Printables must not imply automatic Star Dust, mastery, or completion.
- Printable QR or short links should resolve to reviewed audio cues where young learners need audio support.
- Teacher answer keys require teacher-only access rules.
- Printable puzzle formats require additional validation.
- Crossword requires reviewed clue text, not only vocabulary terms.
- Word Search requires text normalization and layout validation.
- Printed materials should include package id, edition/version, generated date, and tenant/source identity when exported.
- Browser-print previews should show a version snapshot before formal PDF export exists.

## Follow-Up

Build QR placement and version/right snapshots next, then PDF generation. Puzzle printables should come after vocabulary and sentence printables prove layout, QR/audio, and versioning rules.
