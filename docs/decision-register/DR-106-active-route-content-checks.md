# DR-106: Active Route Content Checks

## Decision

The active route verifier should check expected page text for critical admin, media, and teacher-report routes.

## Reason

HTTP 200 checks can pass while a route renders the wrong surface. Lightweight text checks catch obvious route/content regressions without adding a heavier browser-test stack yet.

## Standard

- `/teacher/intake` checks for `Package publish gate`.
- Media playlist routes check for `Media playlist route`.
- Teacher session monitor routes check for `Media engagement`.
- These checks supplement, not replace, visual browser review.
