# DR-694: Assignment Runtime Strict Flags

Status: Accepted

## Decision

Assignment runtime policy, approval, progression, activation, and write fields
must use strict boolean values at the provider-neutral boundary.

## Evidence

- The runtime reports deterministic type errors for malformed assignment flags.
- Stringified values cannot masquerade as classroom approvals, audio readiness,
  support-language policy, student use, private-link activation, or write intent.
- Runtime behavior covers stringified assignment flags while preserving the
  review-only and support-language boundaries.
- No assignment adapter, roster binding, progress stream, or Z.ai integration is
  enabled.

This decision is recorded in
`docs/adr/0622-assignment-runtime-strict-flags.md`.
