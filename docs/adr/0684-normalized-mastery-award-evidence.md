# ADR 0684: Normalized Mastery Award Evidence

## Status

Accepted

## Context

Canonical games calculate a requested award locally, then pass it through the
shared completion adapter. The adapter may reduce that award when earlier
curated activities have already consumed part of the unit's 1,000 Star Dust
capacity. If `mastery_updated` records the requested value while
`game_completed` records the accepted value, the shared completion gate quite
correctly rejects the attempt as inconsistent.

## Decision

Every canonical game must emit `mastery_updated.earnedStarDust` from
`result.earnedStarDust`, the normalized value returned by `completeGameMode`.
The locally calculated value remains the adapter input and may be retained in
game-specific scoring metadata when useful, but it is not authoritative.

## Consequences

- Multi-game unit pathways remain valid after the unit cap is approached.
- Mastery and completion evidence always agree with progression state.
- Scoring profiles remain deterministic and platform-owned.
- Future wrappers must use the same normalized result before integration
  review, regardless of rendering technology.

## Verification

- All 11 canonical game components are checked for normalized mastery award
  evidence.
- Web TypeScript validation covers the updated call sites.
- The shared canonical completion gate continues to enforce award agreement.
