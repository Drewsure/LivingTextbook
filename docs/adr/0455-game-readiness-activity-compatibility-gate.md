# ADR 0455: Game Readiness Activity Compatibility Gate

Status: Accepted

Date: 2026-08-29

## Context

The platform uses curated activity pathways instead of a broad switch-to-anything template panel. The compatibility matrix was visible in foundation intake and AI generator review, but the focused game-readiness route also needs it because game design, Phaser wrappers, and outside prototype review all depend on knowing which activities a reviewed payload can safely become.

## Decision

Show the activity pathway compatibility matrix on `/teacher/game-readiness` alongside parent engine readiness, active replay checks, unit game offers, and prototype intake gates.

## Consequences

- Game design review can see offered, planned, premium, teacher-review, and blocked outputs in the same workbench as prototype intake.
- Z.ai or outside prototype conversations stay tied to curated pathway rules instead of unrestricted template switching.
- Printable, crossword, word-search, microphone, and premium arcade paths remain visible but gated until their payload, audio, reporting, and policy requirements are met.
