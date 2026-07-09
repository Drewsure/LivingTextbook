# DR-067: Recommended Game Path UI

## Decision

Show the full recommended game path in student launch and front-door flows after the target-language entry gate.

## Rationale

The launch session model already supports multiple recommended game modes. Showing only the first mode hid the growing platform surface and made Quiz, Sentence Builder, and Speak It feel disconnected from the unit progression.

## Consequences

- Flashcard completion unlocks multiple reviewed routes.
- Memory Match remains the embedded first activity.
- Other active routes become visible as unlocked route cards.
- Future teacher assignment settings should control which modes appear for a real class.

## Non-Goals

- Branching adaptive sequencing.
- Durable assignment persistence.
- Premium game polish.
