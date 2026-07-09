# Text-Spelling Engine Scaffold

Document type: game engine scaffold contract

Status: active scaffold

## Purpose

The text-spelling parent engine supports sentence construction, ordering, anagram, fill-in, spelling, and typing modes.

The first scaffold is Sentence Builder preview. It proves the reusable contract before a polished game skin is built.

## Current Files

- `apps/web/src/features/game-shell/text-spelling/textSpellingEngineAdapter.ts`
- `apps/web/src/features/game-shell/text-spelling/SentenceBuilderEnginePreview.tsx`

## Current Behavior

- Consumes reviewed `UnitPayload`.
- Uses the two approved target sentence structures.
- Splits each target sentence into ordered word tiles.
- Carries audio text for instructions, full sentence prompts, and tiles.
- Names standard events.
- References `syntax-construction-v1` scoring.

## Required Rules

- Do not generate new grammar inside the game engine.
- Do not hard-code MiniStar-only assumptions.
- Do not make canvas-only text controls the required path for syntax games.
- Any future Phaser or premium skin must wrap the same payload, audio, scoring, and event contract.

## Acceptance Criteria

- Dashboard shows Sentence Builder parent-engine preview.
- The preview displays two sentence rounds.
- Tiles are derived from reviewed target sentences.
- Standard events and integration notes are visible.
- Typecheck/build pass.
