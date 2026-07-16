# DR-259 School Policy Revocation Rollback Preview

Date: 2026-07-16

## Decision

Add a blocked, review-only school policy revocation and rollback preview before acceptance can affect launch readiness.

## Rationale

White-label school pilots need a visible exit path. Revocation authority, release rollback scope, printed QR behavior, learner data/report handling, media/local package handling, and premium feature handling must be reviewed before any school acceptance workflow can change release state.

## Guardrails

- No revocation action.
- No rollback button.
- No release-state mutation.
- No production QR redirect mutation.
- No learner-data deletion workflow.
- No report export.
- No media replacement.
- No local bundle deactivation.
- No AI Tutor entitlement change.
- No live classroom shutdown workflow.

## Verification

- `npm run verify:release-control`
- `npm run verify:foundation`
