# DR-944: Media Release-Control Binding

## Decision

Use an explicit review-only binding to carry media reconciliation evidence into
the existing package publish gate.

## Required Invariants

- Tenant and package identity must match.
- Mismatch is blocked; open evidence is needs-review; evidence-ready is only a
  human review state.
- Promotion, student-facing use, local activation, writes, media release, and
  QR mutation remain blocked with no side effect.

## Evidence

The contract, release-control panel, sample binding, and runtime verifier are
recorded in the ADR and source files named by this decision.
