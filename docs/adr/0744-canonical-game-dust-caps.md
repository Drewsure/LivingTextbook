# ADR 0744: Canonical Game Completion Dust Caps

## Status

Accepted

## Context

Canonical wrappers already used deterministic scoring profile identifiers, but
the progression adapter only enforced the broader 1,000 Star Dust unit cap.
That left a path for a caller to submit an award larger than its mode profile
allowed while still emitting an otherwise valid profile claim.

## Decision

The content model owns a completion dust cap for every canonical game mode.
Web scoring profiles reference this map. The progression adapter clamps each
game-mode award to the mode cap and the remaining unit capacity, and canonical
event validation rejects mastery or completion evidence above the mode cap.

## Consequences

Browser wrappers and future Phaser adapters share one numeric boundary. A
malformed caller cannot increase Star Dust by changing only its event metadata
or requested completion award. This preserves deterministic earned collection
without enabling live persistence, scoring mutation, progression policy
changes, rewards, assignment, or source promotion.

## Verification

Run `npm run verify:game-modes`, `node scripts/verify-runtime-behavior.mjs`,
the canonical game verifier, workspace typecheck, production build, and the
active route verifier.
