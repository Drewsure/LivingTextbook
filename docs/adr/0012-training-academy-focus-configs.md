# ADR 0012: Training Academy Focus Configs

Status: Accepted as foundation behavior

Date: 2026-06-30

## Context

Training Academy began as one vocabulary recovery lane. That was enough to prove the route, reward cap, audio-first practice, and teacher-visible recovery events. The platform now needs to support more recovery reasons without creating separate screens or hard-coded one-off flows.

The white-label product must eventually support different tenants, curriculums, age groups, and recovery types. Recovery should be data/config driven before it becomes visually polished or persisted.

## Decision

Represent Training Academy recovery lanes as focus configs. The first supported focus types are:

- Vocabulary review
- Sentence review
- Audio/listening review
- Spelling review
- Mode practice

Each config owns:

- focus type
- label
- practice title
- learner-facing instruction
- target items
- recommended game mode
- recovery reward cap

The route uses the focus config to render the practice UI, emit teacher-visible metadata, and calculate small deterministic recovery rewards.

## Rationale

White-label impact is positive because recovery behavior is not hard-coded to MiniStar vocabulary practice.

Cost impact is positive because one reusable route can support multiple recovery types without five custom screens.

Pedagogical impact is positive because different struggles can receive different support: words, sentences, listening, spelling, or game procedure.

Architecture impact is positive because future trigger logic can choose a focus type rather than choosing a page.

## Constraints

- Focus configs are local foundation data for now; tenant-level settings come later.
- Recovery remains deterministic and does not require AI Tutor.
- Recovery remains audio-first for all target items and instructions.
- Focus selection emits `training_focus_selected` metadata through the existing recovery metadata bridge.
- Dedicated event types should not be promoted until persistence/reporting requirements are clearer.

## Future Work

- Teacher-controlled focus assignment.
- Tenant-level focus availability and thresholds.
- Query-param or launch-session selected focus when triggered from a specific miss pattern.
- Focus-specific scoring profiles.
- Persistence and teacher report aggregation.
