# DR-265: School Rollback Safe Fallback Storage Contract

## Decision

Create a backend-neutral storage contract for `school_rollback_safe_fallback_plan`.

## Why

Safe fallback wording cannot remain a loose UI-only artifact. Printed QR, local companion, media playlist, teacher handoff, and school support fallback behavior needs durable review metadata before any live redirect, notification, shutdown, replacement, deactivation, or reassignment workflow exists.

## Guardrails

- No production QR redirect mutation.
- No live notification.
- No classroom shutdown workflow.
- No report export.
- No media replacement.
- No local bundle deactivation.
- No student reassignment.

## Verification

`npm run verify:backend-storage`, `npm run verify:release-control`, and active route verification must keep this record visible and blocked.
