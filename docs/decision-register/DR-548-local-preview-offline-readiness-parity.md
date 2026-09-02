# DR-548: Local Preview Offline Readiness Parity

Status: Accepted

Date: 2026-09-03

## Decision

Render the shared PWA/offline readiness gate on both local companion preview routes.

## Rationale

`/local/ministar` and `/local/sample-publisher` are likely partner-demo and closed-companion planning surfaces. They must state the same boundary as `/teacher/intake`: installable shell can exist, but offline readiness remains blocked until cache, media, QR, storage, reporting, rollback, and school-policy evidence exists.

## Guardrails

- No offline-ready claim.
- No service worker registration, cache mutation, media precache, background sync, local installer export, local package activation, learner-data storage, production QR mutation, or report export.
- Route verification must prove both local preview routes show the gate.

## Verification

- `npm.cmd run verify:routes`
- `npm.cmd run verify:local-bundle`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
