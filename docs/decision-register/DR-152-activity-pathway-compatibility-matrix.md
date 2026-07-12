# DR-152: Activity Pathway Compatibility Matrix

## Decision

Use curated activity pathway compatibility rules instead of broad unrestricted template switching.

## Rationale

The platform must save teachers time while protecting young learners, target-language progression, audio support, reporting, and white-label governance. A switch-anything panel would create hidden risk because not every payload can safely become every activity type.

## Accepted Direction

- Add a sample compatibility matrix for the sample publisher Unit 1 package.
- Show the matrix on `/teacher/intake`.
- Add `npm run verify:activity-pathways`.
- Include activity pathway verification in `npm run verify:foundation`.
- Mark printables as planned.
- Mark text puzzles as blocked until proper rules exist.

## Follow-Up

When printable output starts, add a real printable renderer and PDF verification path using the same reviewed package data.
