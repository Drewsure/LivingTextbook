# 2026-07-16 School Policy Revocation Rollback Storage Contract

## Summary

Added the backend-neutral storage contract for school policy revocation and rollback previews.

## Scope

- Added `school_policy_revocation_rollback_preview` to the backend schema draft.
- Added `m043-school-policy-revocation-rollback-preview-records` to migration candidates.
- Added `spec-school-policy-revocation-rollback-preview` to migration specs.
- Added hosted and local persistence write intents for revocation rollback previews.
- Added durable record and persistence boundary entries for revocation rollback previews.
- Extended backend-storage and active-route verification.
- Updated package publish gate documentation, build-session standards, and the decision register.

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

- `npm run verify:backend-storage`
- `npm run verify:foundation`
