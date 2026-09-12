# ADR 0637: Balloon Pop Controlled Integration

**Status:** Accepted for the canonical web slice  
**Date:** 2026-09-12

## Context

Balloon Pop is the second candidate after the verified Memory Match integration. The platform needs an arcade-shaped activity that remains deterministic, reviewable, audio-supported, and safe for young learners before motion-heavy Phaser behavior is considered.

## Decision

Accept the canonical `BalloonPopPracticeGame` as the second controlled game integration over the shared selection parent engine. It uses reviewed deterministic vocabulary rounds, retryable incorrect choices, target-language-aware audio requests, standard progress events, and shared completion/scoring helpers.

The frozen Z.ai Phaser Balloon Pop scene remains outside the production app. Its physics, timing, local persistence, direct telemetry, browser-English TTS, and reward behavior require a separate wrapper review.

## Consequences

- The platform now has verified controlled examples for pairing and selection engines.
- The event, audio, scoring, and progression boundary is proven for both a memory activity and an arcade-shaped activity.
- Phaser review can now compare against real canonical behavior instead of an abstract plan.
- Backend persistence and production assignment rollout remain gated work.
