# ADR-0407: Active Game Replay Checklist

Date: 2026-08-21

## Status

Accepted.

## Context

Returned outside prototypes already have strong review gates, but the first-party active game routes also need a shared evidence posture. Without it, a current route could be treated as a reference implementation even if its fixture, event, audio, scoring, or mobile expectations are not explicit.

## Decision

Add a data-backed active game replay checklist and show it on `/teacher/intake`. Extend game mode coverage verification so every shared `GameModeId` is represented in the checklist and aligned with the catalog parent engine.

## Consequences

- Positive: Future game work has a clear replay standard before polish or outside prototype intake.
- Positive: Current active routes can be audited by game mode and parent engine.
- Positive: Z.ai and Phaser comparisons can use current routes as reference only after replay evidence expectations are met.
- Constraint: Any added game mode must update the catalog, route contracts, parent-engine readiness, and active replay checklist together.

## Verification

See `docs/decision-register/DR-478-active-game-replay-checklist.md`.
