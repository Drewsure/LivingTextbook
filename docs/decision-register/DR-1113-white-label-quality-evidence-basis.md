# DR-1113: White-Label Quality Evidence Basis

## Decision

Require check-specific evidence kinds and non-empty unique scopes for the
seven white-label quality records.

## Required invariants

- Command, route-sweep, browser-rehearsal, privacy-negative-test, and
  tenant-negative-test evidence remain distinct.
- Each record has non-empty unique scope and matching tenant/package identity.
- Mislabeled or scope-less evidence is rejected.
- Evidence cannot enable release, persistence, export, installation, provider
  activation, QR mutation, or student launch.

## Status

Implemented and verified as review-only evidence.
