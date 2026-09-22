# ADR 1000: Pilot Lineage Reconciliation

## Status

Accepted for the review-only foundation.

## Decision

Pilot handoff activation evidence must be resolved against the source
deployment decision, school-policy acceptance preflight, and future
acceptance-record preview. Presence of IDs alone is insufficient.

## Consequences

- Tenant and package drift is detected before a handoff is considered
  internally consistent.
- Deployment selection and policy status cannot silently diverge between
  review panels.
- The same contract can be reused when a future provider-specific adapter is
  reviewed.

## Explicitly blocked

Reconciliation does not accept policy, select a provider, enable persistence,
launch a classroom, mutate QR routes, export reports, or promote a package.
