# DR-257 School Acceptance Record Preview

Date: 2026-07-16

## Decision

Add a blocked, review-only future school acceptance record preview before accepted terms, signatures, evidence export, storage activation, or launch status can exist.

## Rationale

White-label school pilots need to know exactly what would be captured later: school approver identity, policy text version, release candidate, evidence packet, operating consent, premium feature consent, storage/rollback consent, and acceptance effect. Showing this as a blocked preview makes the future workflow auditable without enabling it early.

## Guardrails

- No policy acceptance workflow.
- No accepted terms storage.
- No accept button.
- No signed approval capture.
- No evidence export.
- No storage activation.
- No release-state mutation.
- No launch-ready status.
- No production QR promise.
- No AI Tutor activation.
- No support-language-only progression.
- No real learner data collection.
- No teacher report export.
- No live classroom workflow.

## Verification

- `npm run verify:release-control`
- `npm run verify:foundation`
