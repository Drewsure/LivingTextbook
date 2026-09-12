# DR-700: Progression Runtime Strict Flags

Status: Accepted

## Decision

Progression policy, persistence, reporting, deterministic reward, and target-language
evidence fields must use strict boolean values at the provider-neutral boundary.

## Evidence

- The progression runtime reports deterministic type errors for malformed policy flags.
- Stringified values cannot masquerade as progression authority, persistence, reporting,
  reward, or target-language evidence.
- Runtime behavior covers malformed progression flags while preserving support-only,
  report-only, and review-only boundaries.
- No progression adapter, learner-data write, reward mutation, or Z.ai integration is enabled.

This decision is recorded in `docs/adr/0628-progression-runtime-strict-flags.md`.
