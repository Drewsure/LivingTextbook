# ADR 0965: Active Route Count Source of Truth

Status: Accepted

## Context

The active route matrix contains 89 routes, while several current dashboard
signals and workbench verifiers still described the older 88-route state. That
drift weakened confidence in otherwise passing foundation checks.

## Decision

Treat the current 89-entry active route matrix and the route verifier output as
the authoritative foundation count. Update current route checklists,
deployment and pilot verifiers, teacher status snapshots, and the controlled
Z.ai intake gate together. Historical build notes remain unchanged as
historical evidence.

The deployment decision workbench verifier is also promoted into foundation
composition so hosted, local, packaged, offline, media, and package-tier
boundaries are checked alongside the other foundation guards.

## Consequences

- Current route evidence is internally consistent.
- A future route addition must update the matrix, verifier, status evidence,
  and current checklists together.
- Deployment remains review-only; this does not enable offline delivery,
  installer export, storage activation, or student launch.

## Verification

- `npm run verify:deployment`
- `npm run verify:foundation-composition`
- `npm run verify:routes`
