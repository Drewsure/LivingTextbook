# ADR 0737: Shared Replay-Seed Factory Boundary

## Status

Accepted

## Context

The canonical game validator requires `replay-v1` evidence, but the shared web
progression adapter could copy an invalid provider or wrapper seed directly
into game-start, interaction, audio, and completion events. The later
completion gate would reject that evidence, but the earlier factory boundary
could still manufacture malformed events.

## Decision

Resolve supplied seeds with `resolveCanonicalGameReplaySeed` in every shared
factory that creates canonical game or learning-audio evidence. A malformed
seed falls back to the deterministic unit/mode seed. Components may pass a
platform seed, but they cannot define a second replay format.

## Consequences

Canonical event factories emit valid, stable replay evidence by default, and
future Phaser or provider wrappers share the same behavior. This does not
authorize persistence, scoring mutation, progression, rewards, assignment, or
source import.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, both
workspace typechecks, and `npm run verify:foundation`.
