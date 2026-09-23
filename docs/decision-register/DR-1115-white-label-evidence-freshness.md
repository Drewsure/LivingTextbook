# DR-1115: White-Label Evidence Freshness

## Decision

White-label release quality evidence uses a deterministic seven-day default
freshness period evaluated against an explicit reference time.

## Required invariants

- Future-dated observations are rejected.
- Observations outside the configured freshness period are rejected.
- `verificationReferenceAt` stores the reference time used by the evaluator;
  browser or system time is never read implicitly.
- Freshness remains evidence-only and cannot authorize release, persistence,
  export, installation, provider activation, QR mutation, or student launch.

## Status

Implemented and verified as review-only evidence.
