# ADR 0009: Training Academy Core Recovery Lane

Status: Accepted

Date: 2026-06-30

## Context

Living Textbook needs a recovery path for students who do not reach mastery immediately. This recovery path must support younger learners, English learners, teacher-led classroom use, and student self-progression without requiring premium AI services.

The platform also needs to protect its white-label product shape. Recovery practice must work for MiniStar, textbook partners, closed local deployments, and future tenants without hard-coding a single curriculum, mascot, or AI tutor identity.

## Decision

Training Academy is a core platform lane, not an AI Tutor feature.

The first implementation will use local state, deterministic content, audio-supported learner text, small recovery Star Dust, and standard game/progress event metadata. It will reuse existing parent-game or practice shells wherever possible instead of creating separate recovery-only games.

## Consequences

Positive:

- Core tenants can use recovery practice without paying for AI Tutor.
- Students get a non-shaming route back to the normal unit path.
- Teachers can see recovery practice through event metadata before database persistence exists.
- The platform can later add sentence, listening, spelling, and mode-practice recovery through reusable engine configs.

Tradeoffs:

- The first version uses a metadata bridge because dedicated Training Academy event types are not yet promoted into the shared content model.
- Teacher reports will need a follow-up integration pass to summarize recovery events cleanly.
- Recovery rewards must stay smaller than primary unit-game rewards to avoid exploit paths.

## Constraints

- Training Academy must work with AI Tutor disabled.
- Training Academy must not replace required unit completion.
- Training Academy rewards must be transparent, mastery-driven, and child-safe.
- Training Academy learner-facing text must follow the audio-first standard.
- Training Academy routes must preserve tenant, unit, launch, student-session, focus, and return-path context.
- Dedicated shared event types should be added only after the metadata bridge proves stable in the local-state slice.

## Current Prototype

The active prototype route is `/training/[launchCode]`.

It demonstrates:

- a deterministic vocabulary recovery recommendation,
- tap-to-speak review terms,
- tap-to-speak target sentences,
- `trainingEventType` metadata for required recovery events,
- up to 100 recovery Star Dust,
- and return to `/launch/[launchCode]`.
