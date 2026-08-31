# Build Session Note: Active Game Route Catalog Workbench

Date: 2026-08-31

## What Changed

- Added a review-only active game route catalog panel to `/teacher/game-readiness`.
- Sourced MiniStar and sample publisher playable route links from `getGameModeRoutePath`.
- Made `gameModeCatalog` exhaustive for every `GameModeId`.
- Extended game-mode and active-route verification to protect shared route helper mappings and route catalog visibility.

## Why It Matters

The build is nearing the point where more game prototypes will be reviewed. The route catalog gives Codex, teachers, and future outside builders a clean map of which active mode routes already exist before any Phaser or Z.ai prototype can be considered for integration.

## Blocked Actions

- No route publishing.
- No direct prototype import.
- No template-switch-anything panel.
- No support-language-only progress.

## Verification

- Run `npm run verify:game-modes`.
- Run `npm run typecheck --workspace @living-textbook/web`.
- Run `npm run build --workspace @living-textbook/web`.
- Run `npm run verify:routes`.
