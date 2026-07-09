# Sentence Builder Playable Slice

Document type: playable game slice contract

Status: active scaffold

## Purpose

Sentence Builder is the first playable `text-spelling` parent-engine slice.

It proves that syntax construction can consume reviewed target sentences, render ordered word tiles, support audio-first interaction, emit standard events, and update local progression without premium visual polish.

## Current Route

- `http://127.0.0.1:3000/sentence/demo-unit-1`
- `http://127.0.0.1:3000/sentence/partner-demo-unit-1`

## Current Behavior

- Loads reviewed sample launch context.
- Unlocks `sentence-builder` locally for the scaffold.
- Shows two target sentence rounds.
- Splits each sentence into word tiles.
- Lets students tap tiles into order.
- Lets students remove selected tiles.
- Provides listen/replay for instructions, target sentence, feedback, and tiles.
- Emits local events:
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses `syntax-construction-v1` scoring.

## Non-Goals

- No AI sentence generation.
- No production persistence.
- No premium animation.
- No Phaser skin.
- No report export.

## Acceptance Criteria

- Route loads without runtime error.
- Student can complete both sentence rounds.
- Completion updates local progression and Star Dust.
- Event log shows interaction/completion records.
- Typecheck/build pass.
