# ADR 0657: Target-Language Feedback Audio

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Immediate correctness feedback in a canonical game uses the unit target
language and emits a shared `audio_requested` event. It must not silently
default to English when a white-label unit declares another target language.

## Rationale

The platform is white-label and may support Japanese or another taught
language as the target language. Feedback is part of the learner-facing text
experience, so its locale and evidence must follow the same contract as terms,
sentences, and instructions.

## Boundaries

- Support-language audio remains support-only and cannot unlock progress.
- The adapter owns evidence and progression; the game owns only immediate UI
  feedback state.
- No speech provider, microphone scoring, translation service, or live storage
  is introduced by this decision.
