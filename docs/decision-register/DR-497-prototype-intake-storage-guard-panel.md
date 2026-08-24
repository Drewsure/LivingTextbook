# DR-497: Prototype Intake Storage Guard Panel

## Status

Accepted.

## Decision

Game-readiness and tenant prototype review workbenches must show a prototype intake storage guard before any outside-game intake workflow exists.

## Rationale

The prototype intake queue now has a backend-neutral storage contract. That contract should not remain hidden inside schema files. Teachers, tenant admins, platform admins, and future agents need to see the storage contract ids, visible fields, evidence requirements, and blocked actions at the point where Z.ai or outside prototype inventory is discussed.

## Boundaries

- The guard is review-only.
- It does not create an upload/import workflow.
- It does not write app files.
- It does not replace active routes.
- It does not change scoring or rewards.
- It does not create playlists, packages, or assignments.

## Verification

- `npm run verify:prototype-review`
- `npm run verify:routes`
