# Label It Playable Slice

## Purpose

Label It is the image-aware reference for the pairing parent engine. It proves
that reviewed labels can be placed on reviewed anchor points while image upload
and asset promotion remain behind their separate teacher evidence gates.

## Current Implementation

- Adds `/label-it/[code]` for MiniStar and sample publisher launch codes.
- Builds four deterministic label anchors from reviewed vocabulary.
- Supports tap-to-speak instructions, labels, image-policy guidance, feedback,
  and replay.
- Records label, feedback, and instruction audio-request evidence without
  granting mastery credit.
- Emits the canonical event sequence:
  - `game_started`
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses `pairing-reinforcement-v1` scoring and a deterministic replay seed.
- Keeps anchor and selection state inside the game component while progression,
  tenant identity, launch identity, reporting, and completion remain platform
  owned by the route shell and adapter.

## Standards Preserved

- The current image is a reviewed placeholder; no live student upload exists.
- Future image assets must pass rights, safety, alt text, label-anchor, audio,
  storage, and release gates before becoming playable content.
- Support language cannot complete a round or unlock progress.
- No random rewards, live persistence, AI generation, or Phaser promotion.
- Semantic DOM controls remain available on mobile and are not canvas-only.

## Next Integration Step

Use this slice as the reference for future labelled-diagram asset promotion and
image-aware Phaser candidates. The asset contract must remain separate from
the pairing interaction contract.
