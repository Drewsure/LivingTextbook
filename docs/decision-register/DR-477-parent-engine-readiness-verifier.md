# DR-477: Parent Engine Readiness Verifier

Date: 2026-08-21

Status: Accepted

## Decision

Extend `verify:game-modes` so it also checks parent engine readiness coverage.

## Rationale

The parent engine readiness panel is now a foundation guard for future game work. It should not drift away from the shared `GameModeId` union, game mode catalog, or parent engine list. A verifier keeps the rule enforceable without requiring a reviewer to manually compare the catalog and panel data.

## Impact

- `scripts/verify-game-mode-coverage.mjs` now reads `sampleParentEngineReadiness.ts`.
- Every `ParentEngine` must have one readiness record.
- Every `GameModeId` must appear exactly once in parent engine readiness active modes.
- Each active mode must be listed under the same parent engine used in `gameModeCatalog`.
- Required guardrail phrases are checked: no isolated 48-game build, no support-language-only progress, Phaser review gate, Z.ai Codex gate, and Narrative parent engine visibility.

## Constraints

- This does not add a new active game route.
- This does not authorize Z.ai or Phaser intake.
- This does not change scoring, audio, support-language, upload, storage, or AI Tutor behavior.

## Verification

- `node --check scripts\verify-game-mode-coverage.mjs`
- `npm.cmd run verify:game-modes`
