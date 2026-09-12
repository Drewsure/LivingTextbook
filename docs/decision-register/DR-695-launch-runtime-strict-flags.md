# DR-695: Launch Runtime Strict Flags

Status: Accepted

## Decision

Launch runtime policy, QR, fallback, learner-data, and activation fields must
use strict boolean values at the provider-neutral boundary.

## Evidence

- The runtime reports deterministic type errors for malformed launch flags.
- Stringified values cannot masquerade as QR readiness, policy acceptance,
  learner-data consent, or student-launch intent.
- Runtime behavior covers stringified launch flags while preserving support-only
  progression and review-only activation boundaries.
- No launch adapter, QR mutation, roster binding, or Z.ai integration is
  enabled.

This decision is recorded in
`docs/adr/0623-launch-runtime-strict-flags.md`.
