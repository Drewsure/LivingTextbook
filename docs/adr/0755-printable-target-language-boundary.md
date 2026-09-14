# ADR 0755: Printable Target-Language Boundary

## Status

Accepted

## Context

Interactive games and media already resolved tenant target language before unit
language, but the printable route passed only the unit into its preview. A
white-label tenant override could therefore be lost on a worksheet even while
the same unit used the correct language online.

## Decision

Pass the tenant target language from the printable route into
`PrintableWorksheetPreview` and resolve it before the unit language through
`resolveTargetLanguage`. Keep print as a preview and teacher-controlled bridge.

## Consequences

Printable vocabulary and sentence outputs stay aligned with the tenant's
interactive experience. Print remains non-mastery support and cannot award
Star Dust, completion, or progression. No storage, PDF export, assignment,
reporting, or Phaser source-promotion behavior changes.

## Verification

Run `npm run verify:printables`, the web typecheck, the production build, and
the full foundation suite.
