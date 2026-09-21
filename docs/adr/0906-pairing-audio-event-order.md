# ADR 0906: Pairing Audio Event Order

## Status

Accepted

## Decision

Pairing modes record `round_shown` before requesting term-level learning audio
for a selected card. This applies to the canonical Memory Match and Match Up
surfaces.

## Rationale

The visible interaction is the replay boundary. Audio supports that interaction
and must not appear to be the event that created, answered, or advanced it.
Keeping both pairing surfaces aligned gives teacher reports and future Phaser
wrappers one parent-engine event contract.

## Boundaries

- Audio remains support-only and cannot unlock, score, or complete a game.
- The platform-owned event adapter remains responsible for replay metadata.
- This decision does not authorize frozen-source import or route replacement.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `apps/web/src/features/game-shell/pairing/PairingMatchUpGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`
