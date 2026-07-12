# DR-153: Printable Output Readiness

## Decision

Treat printable activities as a planned foundation capability with explicit export blockers.

## Rationale

Printables matter for teachers, homework, and textbook partners. But an unmanaged worksheet export could drift from reviewed package data, lose audio/QR support, or imply progress that was never recorded. The build should make the printable promise visible while blocking premature PDF handoff.

## Accepted Direction

- Add a printable output plan for the sample publisher package.
- Show printable readiness on `/teacher/intake`.
- Add `npm run verify:printables`.
- Include printables in `npm run verify:foundation`.
- Keep Word Search and Crossword blocked until puzzle rules exist.

## Follow-Up

Build simple browser-print output before PDF generation, then add printable route/package versioning and QR/audio bridge verification.
