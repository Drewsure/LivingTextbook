# DR-691: Content-Package Runtime Strict Flags

Status: Accepted

## Decision

Content-package runtime policy and activation fields must use strict booleans at
the provider-neutral boundary.

## Evidence

- The runtime now reports deterministic type errors for malformed package flags.
- Stringified flags cannot masquerade as accepted pathway, storage, persistence,
  release, student-use, or QR activation evidence.
- Runtime behavior covers stringified package flags while preserving existing
  review-only blockers.
- No storage provider, publisher, QR mutation, assignment, or Z.ai integration
  is enabled.

This decision is recorded in
`docs/adr/0619-content-package-runtime-strict-flags.md`.
