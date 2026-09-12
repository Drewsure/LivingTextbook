# Type Answer Playable Slice

## Purpose

Type Answer is the first canonical text-spelling input slice. It proves that a
student can listen to reviewed target-language vocabulary, type an answer, and
receive deterministic mastery evidence through the same platform contracts as
selection games.

## Current Implementation

- Adds `/type-answer/[code]` for MiniStar and sample publisher launch codes.
- Presents six deterministic vocabulary rounds, one at a time.
- Supports tap-to-speak instructions, prompt words, input guidance, feedback,
  and prompt replay.
- Records shared audio-request evidence without granting mastery credit.
- Emits the canonical event sequence:
  - `game_started`
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses `spelling-typing-v1` scoring and a deterministic replay seed.
- Keeps typed response state inside the game component while progression,
  tenant identity, launch identity, reporting, and completion remain platform
  owned by the route shell and adapter.

## Standards Preserved

- Only the configured target language can produce progress-bearing answers.
- Support language cannot complete a round or unlock progress.
- No random rewards, live persistence, AI generation, or Phaser promotion.
- Semantic input and labelled controls remain available on mobile.
- Frozen Z.ai/Phaser source remains review-only.

## Next Integration Step

Use this slice as the text-spelling reference for Spelling Practice and future
Anagram or Word Ladder variants. Those modes must reuse the same event, audio,
scoring, replay, and identity boundaries.
