# DR-682: Backend Track and Deployment Compatibility

Status: Accepted

## Decision

Migration candidate tracks are now checked against the deployment fit of all
target schema entities. Hosted-pilot work cannot target local-only entities,
local-classroom work cannot target hosted-only entities, and shared work may
target either.

## Evidence

- Regression coverage rejects a hosted-pilot track targeting the local-only
  `local_media_bundle_entry` entity.
- The complete backend storage readiness check passes the current plan.
- No backend vendor, adapter, or live storage write was enabled.

This decision is recorded in
`docs/adr/0610-backend-track-deployment-compatibility.md`.
