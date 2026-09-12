# Spelling Practice Playable Slice

## Purpose

Spelling Practice is the letter-level reference for the text-spelling parent
engine. It proves that a learner can hear a reviewed word, assemble its letters
in order, retry without losing the round, and produce deterministic mastery
evidence.

## Current Implementation

- Adds `/spelling/[code]` for MiniStar and sample publisher launch codes.
- Builds six deterministic vocabulary rounds and letter banks from reviewed
  unit content.
- Supports tap-to-speak instructions, prompt words, answer-area guidance,
  letter tiles, feedback, clear, and prompt replay.
- Records letter-level and automatic feedback audio requests without granting
  mastery credit.
- Emits the canonical event sequence:
  - `game_started`
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses `spelling-typing-v1` scoring and a deterministic replay seed.
- Keeps tile and retry state inside the game component while progression,
  tenant identity, launch identity, reporting, and completion remain platform
  owned by the route shell and adapter.

## Standards Preserved

- Only the configured target language can produce progress-bearing answers.
- Support language cannot complete a round or unlock progress.
- No random rewards, live persistence, AI generation, or Phaser promotion.
- Semantic DOM buttons remain available on mobile and are not canvas-only.
- Frozen Z.ai/Phaser source remains review-only.

## Next Integration Step

Use this slice as the spelling reference for future Anagram, Word Ladder, and
other text-spelling variants. They must preserve the same audio, event,
scoring, replay, and identity boundaries.
