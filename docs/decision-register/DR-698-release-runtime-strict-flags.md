# DR-698: Release Runtime Strict Flags

Status: Accepted

## Decision

Release source, asset, audio, pathway, package, teacher, school, persistence, rollback,
QR mutation, and activation fields must use strict boolean values at the
provider-neutral boundary.

## Evidence

- The release runtime reports deterministic type errors for malformed readiness flags.
- Stringified values cannot masquerade as approval, rollback, QR, or student-activation
  readiness.
- Runtime behavior covers malformed release flags while preserving review-only execution
  and no-mutation boundaries.
- No release adapter, QR mutation, package activation, or Z.ai integration is enabled.

This decision is recorded in `docs/adr/0626-release-runtime-strict-flags.md`.
