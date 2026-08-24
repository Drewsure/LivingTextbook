# ADR 0423: Z.ai Prototype Intake Alert

Status: Accepted

## Context

The user is continuing substantial Z.ai prototype work in parallel. The Living Textbook foundation needs a visible point where Codex can say when outside prototype intake is ready without allowing premature direct imports.

## Decision

Add a `PrototypeIntakeAlertPanel` to `/teacher/game-readiness`. The alert records the current not-ready status, ready-when conditions, required evidence, blocked actions, and Codex ownership rule for controlled Z.ai or outside prototype intake.

## Consequences

- The build preserves the user's Z.ai work as future inventory.
- Codex remains responsible for architecture, schema discipline, wrapper review, and final integration decisions.
- The game-readiness route can show the intake timing without importing code, enabling Phaser wrappers, creating routes, changing scoring, or assigning student work.
