# Build Session Note: Active Game Replay Checklist

Date: 2026-08-21

## Summary

Added a replay checklist for active game routes so current game surfaces have visible fixture, event, audio, scoring, and mobile/accessibility expectations before more game work enters the build.

## Added

- `sampleActiveGameReplayChecklist`
- `ActiveGameReplayChecklistPanel`
- `/teacher/intake` placement after parent engine readiness
- Route verification text for active replay visibility
- `verify:game-modes` coverage for replay checklist mode and engine alignment

## Guardrails Preserved

- No new student routes.
- No live storage, upload, assignment, reward, or report behavior.
- No support-language-only progress.
- No Z.ai or Phaser promotion.

## Verification

- `node --check scripts\verify-game-mode-coverage.mjs`
- `node --check scripts\verify-active-routes.mjs`
- `npm.cmd run verify:game-modes`
