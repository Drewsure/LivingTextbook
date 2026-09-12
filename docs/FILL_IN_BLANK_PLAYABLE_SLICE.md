# Fill in the Blank Playable Slice

## Purpose

Fill in the Blank is the sentence-context reference for the text-spelling
parent engine. It proves that a learner can hear a reviewed sentence, select a
missing reviewed word or phrase, retry without advancing, and produce
deterministic mastery evidence.

## Current Implementation

- Adds `/fill/[code]` for MiniStar and sample publisher launch codes.
- Builds two deterministic rounds from the reviewed target sentences.
- Supports tap-to-speak instructions, sentence prompts, target sentence replay,
  answer choices, choice audio, answer guidance, and feedback.
- Records automatic and interactive audio-request evidence without granting
  mastery credit.
- Emits the canonical event sequence:
  - `game_started`
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses `syntax-construction-v1` scoring and a deterministic replay seed.
- Keeps answer selection and retry state inside the game component while
  progression, tenant identity, launch identity, reporting, and completion
  remain platform owned by the route shell and adapter.

## Standards Preserved

- Choices and sentence content come only from reviewed unit payloads.
- Support language cannot complete a round or unlock progress.
- No random rewards, live persistence, AI generation, or Phaser promotion.
- Semantic DOM controls remain available on mobile and are not canvas-only.
- Frozen Z.ai/Phaser source remains review-only.

## Next Integration Step

Use this slice as the sentence-context reference for future ordering, anagram,
and syntax Phaser variants. They must preserve the same audio, event, scoring,
replay, and identity boundaries.
