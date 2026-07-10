# DR-112: First Pilot Source Strategy

## Decision

Use manually reviewed unit data for the first partner pilot. Treat draft PDF import as a later reviewed workflow and block automatic PDF-to-student publishing.

## Reason

The first pilot should prove the white-label package, game, media, QR/front-door, teacher report, and persistence boundary flow with the lowest risk. PDF import remains important, but extraction errors should not be the first source of student-facing truth.

## Standard

- First partner pilot uses two to four manually reviewed units.
- Draft PDF import may create draft package records only after source review and verifier gates are persisted.
- No parser, AI draft, or OCR output becomes student-facing without human approval.
- Automatic PDF-to-student package publishing is blocked.

