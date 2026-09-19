# DR-945: Release-Control To Pilot Launch Handoff

## Decision

Carry media release-control evidence into the pilot readiness summary and
classroom launch gate as a read-only blocker.

## Required Invariants

- Tenant/package identity, release candidate, reasons, approvals, and blocked
  actions remain traceable.
- Mismatch blocks; open evidence remains review/policy work.
- The handoff cannot launch a class, activate an assignment, collect learner
  data, export reports, or mutate release state.

## Evidence

The summary, launch-gate derivation, and pilot verifier provide the evidence
for this decision.
