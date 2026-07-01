# Selection Engine Preview Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

Verify that the dashboard shows the second parent-engine direction without presenting it as a finished game.

## Route

Verify at:

- `http://127.0.0.1:3000/`

## Required Checks

1. Confirm the dashboard shows a `Selection Engine Preview` card.
2. Confirm the card is labelled as a parent-engine scaffold, not a playable game.
3. Confirm vocabulary and syntax rounds are visible.
4. Confirm each round shows prompt text and audio prompt text.
5. Confirm each option shows whether it is the correct target or a distractor.
6. Confirm standard events include `game_started`, `round_shown`, `answer_submitted`, `answer_result`, `mastery_updated`, and `game_completed`.
7. Confirm the preview states that the same parent engine can later skin quiz and arcade selection modes.
8. Confirm no random reward, AI generation, or finished assessment claim is introduced.

## Acceptance Standard

A reviewer should understand that the selection engine is the next reusable parent-engine direction, while the actual playable student path remains the verified flashcards -> Memory Match -> Speak It/Training Academy foundation slice.
