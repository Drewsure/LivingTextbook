# Teacher Session Assigned Game Path

## Purpose

Teacher session monitors now show the game path assigned to a launch session before the event stream. This separates intended session scope from what a sample student has already completed.

## Current Behavior

- Assigned modes come from `launchSession.entryMode` plus `launchSession.recommendedNextModes`.
- The monitor displays the assigned modes as chips.
- Event reporting remains separate from assigned scope.
- Production customization still requires persisted teacher assignment settings.

## Acceptance Standard

- Teacher session routes load for MiniStar and sample publisher launch codes.
- The monitor shows Flashcards, Match Up, Memory Match, Balloon Pop, Quiz, Sentence Builder, and Speak It.
- The panel does not imply saved teacher customization yet.
- Event completion and assigned scope are visually separate.
