# ADR 0636: Memory Match Controlled Integration

**Status:** Accepted for the canonical web slice  
**Date:** 2026-09-12

## Context

The platform already had a reusable pairing state machine and a Memory Match route. The first controlled integration needed to prove that the learner-facing game could report standard progress events and audio evidence while leaving progression, scoring, rewards, and identity under platform control.

## Decision

Use the canonical DOM `PairingMemoryMatchGame` as the reference controlled integration for the pairing parent engine. It emits a guarded start event, one round event per pair attempt, answer submission/result events, support-only audio requests, and shared completion/mastery events.

The frozen Z.ai Phaser Memory Match scene remains an external prototype to be mapped against this contract later. It is not imported into `apps/web` or `apps/ai-service` by this decision.

## Consequences

- The platform has a verified end-to-end Memory Match slice for student testing.
- Event semantics are now clearer and more useful for teacher reporting.
- The same contract can guide a future Phaser adapter without giving the scene authority over platform state.
- Backend event persistence and production rollout remain future gated work.
