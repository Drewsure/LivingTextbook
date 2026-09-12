# Build Session: Canonical Game Integration Verification

## Goal

Harden the foundation boundary around the accepted Memory Match and Balloon Pop
game slices before beginning Phaser adaptation or broad game expansion.

## Delivered

- Added `scripts/verify-canonical-game-integrations.mjs`.
- Added `npm run verify:canonical-games`.
- Included the gate in `npm run verify:foundation`.
- Verified shared event/audio/completion hooks, route demo-flow composition, and
  state ownership for both canonical games.
- Confirmed direct randomness and browser persistence are not owned by the
  canonical game components.

## Boundary

The frozen Z.ai Phaser suite remains outside `apps/web` and `apps/ai-service`.
The next integration decision is a comparison against these canonical
contracts, not direct source import.

## Verification

`npm run verify:canonical-games` passed.
