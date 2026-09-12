# True or False Playable Slice

## Purpose

True or False is the second canonical selection-engine slice. It proves a
binary listening-and-selection review path while keeping the student flow
small, deterministic, and suitable for future tenant skins.

## Current Implementation

- Adds `/true-false/[code]` for MiniStar and sample publisher launch codes.
- Builds six deterministic vocabulary rounds from the reviewed unit payload.
- Shows one target word and one visible card at a time.
- Supports tap-to-speak instructions, prompts, visible cards, choices, and
  feedback.
- Emits shared audio-request evidence without granting mastery credit.
- Emits the canonical event sequence:
  - `game_started`
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses `selection-assessment-v1` scoring and a deterministic replay seed.
- Carries tenant, launch, unit, student-session, score, and replay identity
  through the shared route shell.

## Standards Preserved

- English or the configured target language is the progression-bearing content.
- Support language cannot complete a round or unlock progress.
- No random rewards, generated student content, or platform-owned storage.
- Text remains in semantic DOM controls and is never canvas-only.
- Frozen Z.ai/Phaser source remains review-only.

## Next Integration Step

Use this slice as the binary-selection reference when reviewing future
True/False, Gameshow, and selection-based Phaser candidates against the shared
event, audio, scoring, and replay contracts.
