# Recommended Game Path UI

## Purpose

The student launch and front-door flows now show the full reviewed game path after entry practice, not only the first next game.

## Current Behavior

- Level 1 sample launch sessions recommend the reviewed early pathway:
  - Match Up
  - Label It
  - Memory Match
  - Balloon Pop
  - Quiz
  - True or False
  - Type Answer
  - Spelling Practice
  - Fill in the Blank
  - Speak It (teacher-controlled)
- Sentence Builder remains a planned Level 2+ offer until target-language segmentation is reviewed for that level.
- Flashcard completion unlocks all recommended modes through the existing `game_unlocked` event model.
- Memory Match remains the embedded first game on the launch/front-door page.
- Ready Level 1 offers are shown as route links after unlock; teacher-controlled Speak It remains visibly gated.
- Locked routes are visible but disabled until target-language flashcard practice is complete.

## Standards Preserved

- Support language does not unlock progress.
- The target-language flashcard gate remains required.
- Each route remains audio-supported.
- The route list is a scaffold/demo navigation surface, not production assignment policy.

## Next Step

Once teacher assignment settings are persisted, teachers should be able to choose which recommended modes appear for a class session.
