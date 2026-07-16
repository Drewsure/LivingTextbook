# DR-268: School Rollback Safe Fallback Activation Preview

## Decision

Add a review-only future safe fallback activation record preview.

## Why

Fallback copy and preflight checks are not enough to define a safe live action. Schools need to see the exact future activation record fields before any implementation can create route pauses, local fallback behavior, media changes, reports, or assignment effects.

## Guardrails

- No activate fallback button.
- No fallback activated marker.
- No release-state mutation.
- No production QR redirect mutation.
- No live notification.
- No classroom shutdown workflow.
- No report export.
- No media replacement.
- No local bundle deactivation.
- No student reassignment.

## Verification

`npm run verify:release-control` and active route verification must confirm the activation preview is visible and blocked.
