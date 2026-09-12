# DR-692: Persistence Runtime Strict Flags

Status: Accepted

## Decision

Persistence runtime privacy, school-policy, and release fields must use strict
boolean values at the provider-neutral boundary.

## Evidence

- The runtime reports deterministic type errors for malformed persistence flags.
- Stringified values cannot masquerade as student-data, raw-audio, school-policy,
  acceptance, or release evidence.
- Runtime behavior covers stringified flags while preserving raw-audio,
  transcript, and release blockers.
- No storage adapter, learner-data write, report export, or Z.ai integration is
  enabled.

This decision is recorded in
`docs/adr/0620-persistence-runtime-strict-flags.md`.
