# Build Session: Shared Game Learning Audio Contract Card

Date: 2026-08-29

## Summary

Added a shared route-level learning-audio contract for active student game routes. The card appears before the playable game surface, shows target-language audio cue coverage, and records route-level rule playback as support-only `audio_requested` evidence.

## Verification Intent

- Confirm active game routes show `Learning audio contract`, `Audio required`, and `Target language only`.
- Confirm `audio_requested` exists in the shared content-model event type.
- Confirm the progress event taxonomy classifies `audio_requested` as support-only.
- Confirm tap-to-speak, support language, and background media cannot unlock progress, mastery, scoring, or rewards.
