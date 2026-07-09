# DR-082: Game Action Audio Controls

## Decision

Use shared audio-supported action controls for learner-facing game actions that submit or reset work.

## Rationale

Young learners and non-fluent readers need a separate listen/replay affordance for critical controls. Quiz and Sentence Builder already had audio-supported prompts, choices, tiles, and feedback; their final action buttons needed the same pattern.

## Consequences

- Quiz Submit answer now uses `AudioSupportedAction`.
- Sentence Builder Reset and Submit sentence now use `AudioSupportedAction`.
- The structural UI remains simple and avoids premium polish.

## Non-Goals

- New game engine work.
- New scoring rules.
- Backend events beyond existing local progression events.
