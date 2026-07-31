# DR-323: AI Prototype Event Replay Report

## Decision

The platform will require a review-only AI prototype event replay report before returned prototypes can continue toward integration review.

## Rationale

External prototypes, including Z.ai or Phaser-heavy work, are useful only if they speak the platform event language. Event replay prevents a prototype from creating hidden local progress, direct score authority, reward writes, report exports, route mutations, playlist writes, local bundle writes, or assignment side effects.

## Implementation Notes

- Generator routes expose the report for sample publisher and MiniStar tenants.
- Reports show standard event coverage, required event order, allowed payload fields, accepted progress effects, failure triggers, and blocked actions.
- Required event coverage includes `game_started`, `round_shown`, `audio_requested`, `answer_submitted`, `answer_result`, `mastery_updated`, and `game_completed`.
- Target-language events are the only learning progress candidates.
- Support-language, media-only, and background-audio events remain support-only.

## Follow-Up

Add a backend-neutral storage contract for `prototype_event_replay_report` after this review surface is verified.
