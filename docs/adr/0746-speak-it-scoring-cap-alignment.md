# ADR 0746: Speak It Scoring-Cap Alignment

## Status

Accepted

## Context

Speak It resolved the canonical speaking/listening scoring profile but then
applied an unrelated hard-coded 200 Star Dust ceiling. The profile and event
validator allowed 400, so the wrapper could not deliver the configured mode
award even after completing every prompt.

## Decision

Speak It uses the required profile's `completionDustCap` for its deterministic
completion award. The shared progression adapter still clamps the result to the
mode cap and remaining unit economy, and canonical event validation remains the
final boundary.

## Consequences

The wrapper, profile, progression adapter, and event evidence now agree on the
same mode-owned cap. White-label tenants can change the canonical profile map
without leaving a hidden wrapper-specific ceiling.

## Verification

Run `npm run verify:canonical-games`, `node scripts/verify-runtime-behavior.mjs`,
workspace typecheck, production build, and the active route verifier.
