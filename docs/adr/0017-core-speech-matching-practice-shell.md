# ADR 0017: Core Speech Practice Shell Before AI Speech Matching

Status: Accepted

Date: 2026-07-01

## Context

The platform already has speaking/listening games in its game taxonomy, and at least two legacy or planned game ideas depend on speech matching. The premium Voice Tutor layer can later provide AI-assisted speech-to-text, pronunciation feedback, and fluency coaching, but the core platform needs a cheaper, classroom-safe speaking foundation first.

## Decision

Build `Speak It` first as a core audio-led practice shell.

The first implementation is self/teacher confirmed:

- student listens to the target-language prompt,
- student says it out loud,
- student taps `I said it`,
- progress events are recorded,
- Star Dust can be awarded,
- no microphone access is requested,
- no AI Tutor entitlement is required,
- no speech-to-text, transcript storage, or pronunciation scoring is used.

This keeps speaking practice available to younger learners, local/offline deployments, and standard tenants before premium speech services are introduced.

## Consequences

Positive:

- Speaking/listening games become part of the core engine path, not only future AI Tutor features.
- The platform gets a clean event and UI pattern for oral practice.
- Teacher-led classrooms can use the mode immediately without privacy or infrastructure overhead.
- Premium Voice Tutor can later upgrade the same mode with speech matching.

Tradeoffs:

- Self-confirmed speech is not the same as automatic pronunciation assessment.
- Teacher observation or classroom norms are needed for true spoken accuracy in the core version.
- Future AI speech matching must preserve this no-AI fallback for cost, privacy, and offline resilience.

## Verification

- `/speak/demo-unit-1` opens a standalone Speak It practice route.
- The route does not request microphone access.
- Student-facing prompts are audio-supported.
- `I said it` records progress without speech services.
- Completing all prompts records `mastery_updated` and `game_completed` events.
- The dashboard sequence includes Speak It as a foundation mode after Memory Match.
