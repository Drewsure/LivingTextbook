# DR-478: Active Game Replay Checklist

Date: 2026-08-21

Status: Accepted

## Decision

Add an active game replay checklist to `/teacher/intake` and verify it against the shared game mode catalog.

## Rationale

The build now has multiple active game routes across Pairing, Selection, and Text-spelling parent engines. Before more game modes, Phaser wrappers, outside prototypes, or premium polish enter the product, each active route needs a visible replay standard: reviewed fixture loading, standard events, target-language audio coverage, deterministic scoring, and mobile/accessibility expectations.

## Impact

- `/teacher/intake` now shows `Active game replay checklist`.
- The checklist covers all 12 active `GameModeId` values.
- Each record names route paths, parent engine, fixture expectation, event expectation, audio expectation, scoring expectation, and failure triggers.
- `verify:game-modes` now checks active replay checklist coverage and engine alignment.
- Active route verification keeps the replay checklist visible on the teacher/admin foundation page.

## Constraints

- No new student route was added.
- No game scoring, storage, upload, support-language, microphone, route, reward, or assignment behavior changed.
- No Z.ai or Phaser intake is authorized by this checklist.
- Support-language, media-only, background music, hints, and visual polish remain unable to unlock progress.

## Verification

- `node --check scripts\verify-game-mode-coverage.mjs`
- `node --check scripts\verify-active-routes.mjs`
- `npm.cmd run verify:game-modes`
