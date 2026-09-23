# DR-1112: Deployment Handoff Identity Reconciliation

## Decision

Bind explicit release-readiness tenant and package identities to the
commercial deployment handoff and block identity drift.

## Required invariants

- Readiness tenant matches the deployment decision tenant.
- Readiness package matches the deployment decision package.
- Any mismatch is visible in the blocker set for every deployment artifact.
- Provider selection, persistence, installation, promotion, QR mutation, and
  student launch remain false.

## Status

Implemented and verified as review-only evidence.
