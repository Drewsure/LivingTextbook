# Match Up Playable Slice

## Purpose

Match Up is the visible listening-to-word reference for the pairing parent
engine. It proves that source prompts and target vocabulary cards can share a
deterministic matching contract while preserving audio, retry evidence, and
teacher-readable progress.

## Current Implementation

- Adds `/match/[code]` for MiniStar and sample publisher launch codes.
- Builds deterministic source and target card pairs from reviewed vocabulary.
- Supports tap-to-speak instructions, listening prompts, word cards, selection
  status, feedback, and replay.
- Records card and feedback audio-request evidence without granting mastery
  credit.
- Emits the canonical event sequence:
  - `game_started`
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses the pairing scoring profile and deterministic replay identity.
- Keeps pairing state inside the parent-engine component while progression,
  tenant identity, launch identity, reporting, and completion remain platform
  owned by the route shell and adapter.

## Standards Preserved

- Source and target cards come only from reviewed unit vocabulary.
- Support language cannot complete a match or unlock progress.
- No random rewards, live persistence, AI generation, or Phaser promotion.
- Semantic DOM controls remain available on mobile and are not canvas-only.
- Frozen Z.ai/Phaser source remains review-only.

## Next Integration Step

Use this slice as the pairing reference for future matching-pairs, word-match,
and Phaser pairing skins. They must preserve the same event, audio, scoring,
replay, and identity boundaries.
