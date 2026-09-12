# DR-693: Teacher-Report Runtime Strict Flags

Status: Accepted

## Decision

Teacher-report runtime policy, approval, and privacy fields must use strict
boolean values at the provider-neutral boundary.

## Evidence

- The runtime reports deterministic type errors for malformed report flags.
- Stringified values cannot masquerade as teacher approval, policy acceptance,
  export readiness, release approval, or media exclusion evidence.
- Runtime behavior covers stringified report flags while preserving pseudonymous,
  raw-audio, transcript, and no-export boundaries.
- No report adapter, learner-data export, or Z.ai integration is enabled.

This decision is recorded in
`docs/adr/0621-teacher-report-runtime-strict-flags.md`.
