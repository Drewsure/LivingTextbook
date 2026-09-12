# DR-696: Asset Runtime Strict Flags

Status: Accepted

## Decision

Asset policy, mapping, release, storage, size-budget, learner-media, learner-upload,
and activation fields must use strict boolean values at the provider-neutral boundary.

## Evidence

- The asset runtime reports deterministic type errors for malformed readiness flags.
- Stringified values cannot masquerade as storage acceptance, mapping review, release
  approval, or learner-media safety.
- Runtime behavior covers malformed asset flags while preserving review-only execution
  and the no-upload boundary.
- No asset adapter, storage write, media transform, or Z.ai integration is enabled.

This decision is recorded in `docs/adr/0624-asset-runtime-strict-flags.md`.
