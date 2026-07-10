# DR-090: Training Focus Route Query

## Decision

Training Academy routes may accept `?focus=[TrainingFocusType]`.

## Reason

Recovery triggers can identify a specific lane, such as vocabulary, sentence, listening, spelling, or mode practice. Passing focus through the route keeps the student in the correct recovery lane without creating separate one-off routes.

## Standard

- `/training/[launchCode]` remains valid.
- `/training/[launchCode]?focus=sentence-review` and other reviewed focus values are valid.
- Unknown focus values fall back to vocabulary review.
- AI Tutor is not required for focus routing.

