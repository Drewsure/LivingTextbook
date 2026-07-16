# DR-260 School Policy Revocation Rollback Storage Contract

Date: 2026-07-16

## Decision

Persist school policy revocation and rollback preview requirements as a backend-neutral storage contract before school acceptance can affect launch readiness.

## Rationale

White-label pilots, printed textbook QR routes, local companion packages, media rights, reports, and optional premium features need a safe exit path before schools approve live use. Preserving rollback preview metadata across hosted and local plans prevents future acceptance work from becoming a one-way release mutation.

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
