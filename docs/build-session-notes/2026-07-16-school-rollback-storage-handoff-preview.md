# 2026-07-16 School Rollback Storage Handoff Preview

## Summary

Added a visible storage-contract handoff to the school policy revocation and rollback preview.

## Scope

- Added storage contract metadata to `sampleSchoolPolicyRevocationRollbackPlan`.
- Rendered schema entity id, category id, durable record id, primary key, hosted write intent, local write intent, and blocked-live-action count in `SchoolPolicyRevocationRollbackPanel`.
- Extended release-control verification to keep the storage handoff visible and non-actionable.

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
