# DR-267: School Rollback Safe Fallback Preflight Storage Contract

## Decision

Create a backend-neutral storage contract for `school_rollback_safe_fallback_preflight`.

## Why

The fallback activation checklist cannot remain a loose UI-only artifact. Schools and publishers need durable review metadata before any live fallback activation, route pause, notification, report, local package, media, or assignment workflow is designed.

## Guardrails

- No fallback activation.
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
