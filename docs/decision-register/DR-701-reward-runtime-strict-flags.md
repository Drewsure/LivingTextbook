# DR-701: Reward Runtime Strict Flags

Status: Accepted

## Decision

Reward mastery, provenance, policy, persistence, release, random-reward, gacha-pressure,
purchase, and Spin Wheel fields must use strict boolean values at the provider-neutral
boundary.

## Evidence

- The reward runtime reports deterministic type errors for malformed reward flags.
- Stringified values cannot masquerade as mastery, ownership, policy, release, or
  anti-gacha safeguards.
- Runtime behavior covers malformed reward flags while preserving earned-only and
  review-only boundaries.
- No collection adapter, inventory write, ticket issuance, or Z.ai integration is enabled.

This decision is recorded in `docs/adr/0629-reward-runtime-strict-flags.md`.
