# DR-262: School Rollback Impact Matrix

## Decision

Add a review-only `School rollback impact matrix` to the rollback foundation surfaces.

## Why

Rollback is not just a button. It affects release records, printed QR routes, learner-data/report policy, media and local packages, optional premium features, and support operations. The platform needs a visible impact map before any future workflow can be safely designed.

## Guardrails

- No release-state mutation.
- No production QR redirect mutation.
- No learner-data deletion workflow.
- No report export.
- No media replacement.
- No local bundle deactivation.
- No AI Tutor entitlement change.
- No live classroom shutdown workflow.

## Verification

`npm run verify:release-control` and active route verification must confirm the matrix is visible on the school/admin review routes.
