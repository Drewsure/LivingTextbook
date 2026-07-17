# DR-271: School Rollback Safe Fallback Restoration Preview Storage Contract

## Decision

Create a backend-neutral storage contract for `school_rollback_safe_fallback_restoration_preview`.

## Why

Future fallback restoration fields should be reviewable and auditable before any restoration workflow exists. The storage contract keeps that future shape portable across hosted and closed/local deployments without enabling side effects.

## Guardrails

- No restoration activation.
- No restored marker.
- No release-state mutation.
- No production QR redirect mutation.
- No live notification.
- No classroom restart workflow.
- No report export.
- No media restoration.
- No local bundle restoration.
- No student reassignment.

## Verification

`npm run verify:backend-storage`, `npm run verify:release-control`, and active route verification must keep this record visible and blocked.
