# DR-699: Recovery Runtime Strict Flags

Status: Accepted

## Decision

Recovery persistence, backup, checksum, encryption, access-control, retention,
school-policy, report-integrity, rollback, release, raw-learner-media, and local-fallback
fields must use strict boolean values at the provider-neutral boundary.

## Evidence

- The recovery runtime reports deterministic type errors for malformed readiness flags.
- Stringified values cannot masquerade as backup, privacy, rollback, release, or local
  fallback readiness.
- Runtime behavior covers malformed recovery flags while preserving review-only execution
  and no-write boundaries.
- No recovery adapter, archive write, restore, or Z.ai integration is enabled.

This decision is recorded in `docs/adr/0627-recovery-runtime-strict-flags.md`.
