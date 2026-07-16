# DR-266: School Rollback Safe Fallback Preflight

## Decision

Add a review-only preflight for safe fallback activation.

## Why

Before fallback copy or route-pause behavior can ever be used, the team must know whether child-safe copy, school communication, printed QR, local companion, media playlist, assignment, and report policies are complete.

## Guardrails

- No fallback activation.
- No production QR redirect mutation.
- No live notification.
- No classroom shutdown workflow.
- No local bundle deactivation.
- No media replacement.
- No student reassignment.
- No report export.

## Verification

`npm run verify:release-control` and active route verification must confirm the preflight is visible and blocked.
