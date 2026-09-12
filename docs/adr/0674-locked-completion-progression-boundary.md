# ADR 0674: Locked Completion Progression Boundary

## Decision

`completeGameMode` must independently verify that the requested game mode is
present in `progression.unlockedGameModes`. A locked request returns unchanged
progression and zero Star Dust without emitting a completion event.

## Rationale

The playable route shell prevents normal locked routes from mounting a game,
but wrappers, future adapters, and test harnesses can call progression code
without that UI context. Scoring and reward authority therefore needs its own
defence-in-depth check.

## Consequences

- Direct URLs and future Phaser wrappers cannot earn completion by bypassing
  the route shell.
- The entry-practice and curated unlock sequence remains authoritative.
- No new persistence, route, or assignment behavior is enabled.
- The canonical verifier must keep both route and adapter checks present.
