# Build Session: White-Label Controlled Pilot Decision Binding

## Goal

Make the controlled-pilot phase of release readiness use the authoritative
tenant/package-bound pilot review decision.

## Completed

- Added pilot decision identity, handoff routes, evidence bindings, blocker
  count, and launch/data/report permissions to the shared release contract.
- Bound the Sample Publisher dashboard to the existing pilot review decision.
- Added visible pilot blockers while keeping live launch and learner data
  disabled.
- Added tenant and blocker-count negative-path verification.
- Recorded ADR 0960 and DR-1032.
