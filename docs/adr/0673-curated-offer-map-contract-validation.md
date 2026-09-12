# ADR 0673: Curated Offer Map Contract Validation

## Decision

Every curated unit game offer map must validate each offer against the shared
game-mode contract before it is shown as a clean review record. Validation
covers tenant scope, unique offer and mode identity, parent family, parent
engine, required ready-route, and declared audio/reporting/next-step rules.

## Rationale

Curated pathways are the platform's deliberate alternative to a broad
switch-template panel. A family or engine mismatch can make a teacher-facing
map advertise the wrong implementation even while the student route appears
to work. Keeping this check beside the data makes white-label package review
cheaper and prevents drift between content-model contracts and route offers.

## Consequences

- Flashcards remain bound to the selection parent engine.
- MiniStar and partner offer maps use the same contract validator.
- A map can be displayed for review with visible errors, but it is not clean
  package evidence until the errors are resolved.
- This validator does not publish routes, assign students, or mutate package
  data.
