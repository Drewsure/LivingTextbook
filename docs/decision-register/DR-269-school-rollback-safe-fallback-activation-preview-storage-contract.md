# DR-269: School Rollback Safe Fallback Activation Preview Storage Contract

## Decision

Create a backend-neutral storage contract for `school_rollback_safe_fallback_activation_preview`.

## Why

Future fallback activation fields should be reviewable and auditable before any activation workflow exists. The storage contract keeps that future shape portable across hosted and closed/local deployments without enabling side effects.

## Guardrails

- No fallback activation.
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

`npm run verify:backend-storage`, `npm run verify:release-control`, and active route verification must keep this record visible and blocked.
