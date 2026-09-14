# ADR 0740: Canonical Game Scoring Profile

## Status

Accepted

## Context

Canonical game validation already required mastery and completion events to
identify a scoring profile and to agree with one another. A malformed wrapper
could still claim the profile for another game mode and pass that boundary.

## Decision

Keep the complete game-mode-to-scoring-profile mapping in the shared content
model. Require both `mastery_updated` and `game_completed` evidence to use the
profile assigned to the expected game mode.

## Consequences

Browser games, report evidence, and future Phaser wrappers share one scoring
identity and cannot switch profiles through event metadata. This does not
enable live persistence, scoring mutation, progression, rewards, assignment,
or source promotion.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, both
workspace typechecks, and `npm run verify:foundation`.
