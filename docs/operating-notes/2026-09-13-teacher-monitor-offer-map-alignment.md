# Operating Note OW-052: Teacher Monitor Offer-Map Alignment

## Context

The teacher session monitor is a review-only sample, but it still needs to
represent the same tenant and curriculum rules as the student pathway. A
separate hard-coded mode list drifted after Level 1 Sentence Builder was
correctly moved to planned Level 2+ status.

## Procedure

When a game offer changes:

1. Resolve the offer map using the monitor launch context package id.
2. Derive sample student progression only from ready, student-eligible offers.
3. Keep launch-session assigned scope separate from completed progression scope.
4. Check that blocked, teacher-only, premium, and not-ready modes do not become
   completed student evidence.
5. Run the canonical game, report-runtime, typecheck, and active-route checks.

## Resolution

`sampleTeacherSessionMonitor.ts` now uses `findSampleUnitGameOfferMap` and a
`reviewedReadyModes` projection for sample unlocked and completed modes. The
stale Level 1 Sentence Builder event evidence and manual progression entries
were removed. The monitor remains a preview and does not activate persistence,
report export, or classroom data collection.
