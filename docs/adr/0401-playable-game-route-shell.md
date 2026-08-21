# ADR-0401: Playable Game Route Shell

Date: 2026-08-21

## Status

Accepted.

## Context

The active student game routes are growing across pairing, selection, text-spelling, arcade, and speaking families. Several text-spelling routes used the same wrapper pattern for header, teacher assignment settings, session progress, completion next step, and event logs.

Foundation quality now depends on making these route structures reusable before adding more game modes, premium visuals, Phaser wrappers, or outside prototype intake.

## Decision

Introduce `PlayableGameRouteShell` for active playable routes that need standard progress and completion plumbing. Keep the child game component responsible for the actual game interaction.

## Consequences

- Positive: New game routes can reuse a stable shell instead of copying route-level state.
- Positive: Assignment settings, progress summary, deterministic reward display, and next-activity routing stay consistent.
- Positive: Future premium skins can focus on the game surface rather than route wiring.
- Constraint: Game-specific components must still emit standard progress events and use approved scoring adapters.
- Constraint: Support-language, media-only, and report-only events remain unable to unlock progress.
- Constraint: This does not import or authorize Z.ai prototypes.

## Verification

See `docs/decision-register/DR-472-playable-game-route-shell.md`.
