# 2026-07-16 School Policy Revocation Rollback Preview

## Summary

Added a review-only school policy revocation and rollback preview.

## Scope

- Added `sampleSchoolPolicyRevocationRollbackPlan`.
- Added `SchoolPolicyRevocationRollbackPanel`.
- Rendered the preview on teacher intake, classroom launch gate, and focused school policy handoff routes.
- Extended release-control and active-route verification.
- Updated package publish gate documentation and build-session standards.

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
