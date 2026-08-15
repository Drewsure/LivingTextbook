# 2026-08-15: Match Up Active Route

## Summary

Added a visible pairing game route at `/match/[code]` for both sample tenants.

## Implemented

- Added `match-up` to the shared `GameModeId` union, mode catalog, scoring map, route contracts, route helpers, active route matrix, and active route verifier.
- Added `PairingMatchUpGame` and `MatchUpDemoFlow`.
- Added `/match/demo-unit-1` and `/match/partner-demo-unit-1`.
- Added Match Up to curated activity hubs, recommended student route cards, teacher route shortcuts, sample launch sessions, assignment plans, audio cue coverage, package readiness, local bundle planning, and activity pathway compatibility.
- Updated documentation and decision records to treat Match Up as the visible pairing bridge before Memory Match.
- Updated active route verification to fetch routes in small batches because the 65-route matrix is now too large for comfortable sequential sweeps on a slow local dev server.

## Boundaries

- No live upload, storage, AI Tutor, microphone, Phaser, random reward, or production classroom launch behavior was added.
- Match Up remains a structural parent-engine route. Premium visuals or Phaser polish must wrap this contract later.

## Verified

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:game-modes`
- `npm run verify:package-readiness`
- `npm run verify:local-bundle`
- `npm run verify:activity-pathways`
- `npm run verify:routes`
