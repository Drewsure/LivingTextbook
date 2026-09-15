# ADR 0792: Tenant-Owned Audio Evidence

## Status

Accepted

## Decision

`getGameAudioCoverage` must scope learner-facing audio cues by both the active
unit key and the active unit tenant identifier. A cue with a matching unit key
but a different tenant owner is excluded from all term, sentence, and
instruction readiness calculations.

## Rationale

The unit key normally includes the tenant, and package validation already
checks ownership. Runtime helpers still need an explicit ownership check so a
malformed package, adapter, or future service boundary cannot make one
tenant's media appear to satisfy another tenant's learner route.

## Consequences

- White-label tenant isolation is enforced at the final audio-readiness gate.
- Cross-tenant cues fail closed without producing learner progress.
- Valid sample packages and canonical game routes are unchanged.
- This does not enable uploads, live AI, persistence, assignment, or Phaser
  promotion.
