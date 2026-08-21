# ADR 0389: Shared Game Completion Next Path

Date: 2026-08-21

## Status

Accepted

## Context

The foundation now includes several active game routes. Without a shared completion pathway, each route could drift into a different end-state UI, making learner progression inconsistent and making future white-label tenants harder to maintain.

## Decision

Use a shared completion next-path card across active non-entry game routes. The card reads existing progression state, shows deterministic reward information, and links to the next reviewed activity, activity hub, and Training Academy.

## Consequences

- Game routes get a consistent finish-and-continue surface.
- Completion guidance stays separate from scoring and event creation.
- Curated reviewed pathways remain the core promise; the card does not become a template-switch panel.

## Links

- `docs/decision-register/DR-460-shared-game-completion-next-path.md`
- `docs/verification/GAME_COMPLETION_NEXT_PATH_CHECKS.md`
