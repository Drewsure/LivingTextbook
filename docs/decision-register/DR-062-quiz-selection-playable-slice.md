# DR-062: Quiz Selection Playable Slice

## Decision

Promote Quiz from a blocked sample offer to a playable optional selection-engine route.

## Rationale

The platform needs one plain selected-response engine before arcade selection games are built. Quiz gives a small, inspectable baseline for prompts, choices, audio, scoring, and progress events without involving Phaser or premium animation.

## Consequences

- Selection-engine behavior can be tested through `/quiz/[code]`.
- The game offer map now has a ready selection-engine game in addition to future arcade selection offers.
- Z.ai arcade prototypes should conform to this event and scoring contract instead of inventing their own.

## Non-Goals

- High-stakes assessment.
- Randomized question banks.
- AI-generated distractors.
- Production analytics.
