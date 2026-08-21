# 2026-08-21 Spelling Practice Active Route

## Summary

Added first-class Spelling Practice routes for the MiniStar and sample publisher demo packages.

## Changes

- Added `/spelling/[code]` with a reusable `SpellingPracticeDemoFlow`.
- Reused the text-spelling parent engine and added a deterministic letter-tile spelling game.
- Added a `getSpellingPracticePath` route helper.
- Updated student recommended routes, curated activity hub, game sequence, teacher assignment plans, package readiness, local companion route maps, and teacher review mode labels.
- Added MiniStar and sample publisher Spelling Practice entries to the active route matrix and active route QA list.
- Updated route verification expectations from 71 to 73 checked routes.

## Boundaries

- No scoring rule changed outside mapping Spelling Practice to the existing `spelling-typing-v1` profile.
- No support-language activity can unlock or complete Spelling Practice.
- No uploaded media, generated package, teacher draft, QR alias, live assignment, or outside prototype was promoted.
- Spelling Practice remains a core structural route, not a premium visual skin.

## Verification Target

Run focused package, game-mode, activity-pathway, local-bundle, and route checks, then the full foundation verification once the route passes locally.
