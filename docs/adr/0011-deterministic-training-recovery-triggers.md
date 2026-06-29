# ADR 0011: Deterministic Training Academy Recovery Triggers

Status: Accepted as foundation behavior

Date: 2026-06-30

## Context

The platform needs to recommend Training Academy support when a student struggles, but the foundation build must stay cost-efficient, explainable, white-label compatible, and independent from optional premium AI Tutor services.

The first playable path already emits Memory Match events for `answer_result`, `game_completed`, attempts, total pairs, and earned Star Dust. Those events are enough to recommend recovery without introducing persistence, AI calls, analytics infrastructure, or teacher dashboards.

## Decision

Use deterministic local trigger rules for the first Training Academy recommendations:

- Repeated misses: recommend recovery after at least two incorrect answer results in the active post-flashcard game.
- Low completion result: recommend recovery after a completed game if the reward is low enough or the attempts-to-pairs ratio is high enough.
- Recommendation event: emit one `training_recommended` event per trigger id using the current Training Academy metadata bridge.
- Student surface: show a learner-facing recovery card with audio-supported text and an optional link to `/training/[code]`.
- No blocking: the recommendation does not prevent the student from continuing the normal game path.

## Rationale

White-label impact is positive because the same rule engine can work for MiniStar and future textbook tenants without hard-coded curriculum assumptions.

Cost impact is positive because deterministic rules do not require model calls, speech services, database persistence, or adaptive AI infrastructure.

Teacher trust is stronger because the reason can be explained in simple terms: repeated misses or low completion result.

Student safety is stronger because the recommendation is supportive, non-shaming, and does not create pressure or punishment.

## Constraints

- Recovery triggers must remain configurable later; current thresholds are foundation defaults, not permanent global policy.
- Recovery recommendation events must remain in the same progress stream until persistence and analytics prove a separate stream is needed.
- AI Tutor must not be used for this foundation recovery trigger.
- A recommendation must not spam repeated events after every miss.
- Recommendation copy must remain supportive and audio-supported.

## Current Defaults

- Repeated miss threshold: 2 incorrect answer results.
- Low completion reward threshold: 120 Star Dust or less.
- High attempt ratio threshold: 2.25 attempts per pair or higher.

## Future Work

- Tenant-level trigger settings.
- Teacher-controlled thresholds.
- Focus-specific recovery configs for sentence, listening, spelling, and mode-practice recovery.
- Persistence rules for classroom reporting.
- Decision-register promotion if these thresholds become durable platform policy.
