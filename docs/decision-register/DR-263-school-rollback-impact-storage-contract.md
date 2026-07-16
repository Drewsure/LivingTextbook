# DR-263: School Rollback Impact Storage Contract

## Decision

Create a backend-neutral storage contract for `school_policy_rollback_impact_matrix`.

## Why

Rollback impact cannot remain a loose UI-only artifact. Schools, publishers, hosted deployments, and closed/local textbook companions need the same durable vocabulary for affected records, required evidence, blocked actions, and matrix rules before any live rollback workflow exists.

## Guardrails

- No release-state mutation.
- No production QR redirect mutation.
- No learner-data deletion workflow.
- No report export.
- No media replacement.
- No local bundle deactivation.
- No AI Tutor entitlement change.
- No live classroom shutdown workflow.

## Verification

`npm run verify:backend-storage`, `npm run verify:release-control`, and active route verification must keep this record visible and blocked.
