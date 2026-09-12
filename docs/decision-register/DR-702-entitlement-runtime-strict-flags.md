# DR-702: Entitlement Runtime Strict Flags

Status: Accepted

## Decision

Entitlement teacher, school, privacy, cost, persistence, release, level, usage-limit,
and target-language-audio fields must use strict boolean values at the provider-neutral
boundary.

## Evidence

- The entitlement runtime reports deterministic type errors for malformed readiness flags.
- Stringified values cannot masquerade as consent, cost, privacy, package-tier, or audio
  readiness.
- Runtime behavior covers malformed entitlement flags while preserving premium and
  review-only boundaries.
- No billing, microphone capture, AI Tutor dispatch, feature activation, or Z.ai
  integration is enabled.

This decision is recorded in `docs/adr/0630-entitlement-runtime-strict-flags.md`.
