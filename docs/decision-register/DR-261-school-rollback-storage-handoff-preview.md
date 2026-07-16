# DR-261 School Rollback Storage Handoff Preview

Date: 2026-07-16

## Decision

Expose the revocation and rollback storage contract IDs directly inside the read-only school policy rollback preview.

## Rationale

The platform should make review boundaries visible to non-developer stakeholders. Showing the entity id, durable record id, primary key, and hosted/local write intents makes future implementation expectations clear without enabling live workflow behavior.

## Guardrails

- Storage handoff is informational only.
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
