# ADR 0642: Canonical Game Replay Seed

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Canonical game routes derive a stable replay seed from the unit key and game
mode. The seed is recorded in the `game_started`, round, and completion event
metadata used by the reference integrations and surfaced in the shared session
event log when replay evidence is available.

The seed is deterministic and tenant-neutral. It is not a reward seed, a
random cosmetic source, or a replacement for teacher/session identity.

## Rationale

The frozen Phaser candidates use randomness for ordering, timing, placement, and
animation. The platform must be able to compare a returned scene against a
repeatable reference contract before allowing wrapper integration. The canonical
DOM slices therefore establish the replay-evidence shape first.

## Boundaries

- The platform owns the seed and replay evidence.
- A game view may consume the seed for presentation, but may not invent a
  second scoring or reward seed.
- Replay evidence does not approve a Phaser candidate or enable student use.
- Tenant branding, language policy, audio, score, and persistence remain outside
  the seed.
