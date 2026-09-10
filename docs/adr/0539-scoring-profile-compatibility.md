# ADR-0539: Scoring Profile Compatibility

Status: Accepted

## Context

The web catalog identifies each curated mode's parent engine, learner role, and skill focus. Scoring profiles previously declared reward math but did not state which catalog semantics they supported, leaving a gap where a valid profile ID could be attached to the wrong mode.

## Decision

Each scoring profile must declare supported parent engines, learner roles, and skill focuses. The game-mode verification gate must compare those declarations with every catalog mode's selected profile.

## Consequences

- New profiles must explain their semantic scope before they can be referenced.
- A mode cannot silently inherit a profile designed for a different engine or pedagogical purpose.
- Verification remains provider-neutral and has no progression or reward side effects.
- Profile changes require focused scoring replay and catalog verification before promotion.

## Verification

- `npm run verify:game-modes`
- `npm run verify:foundation`
