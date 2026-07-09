# Quiz Reporting Bridge

## Purpose

Quiz now appears in the sample teacher monitor as the first playable selection-engine completion. This keeps selected-response games aligned with the same teacher-visible event stream used by Memory Match, Sentence Builder, Speak It, and Training Academy.

## Current Implementation

- The sample teacher monitor progression includes `quiz` as unlocked and completed.
- The sample monitor event stream includes `game_started`, `answer_result`, and `mastery_updated` for Quiz.
- Quiz events identify `parentEngine: "selection"` and `scoringProfileId: "selection-assessment-v1"`.
- The sample unit reward total is capped at 1,000 Star Dust.

## Acceptance Standard

- Teacher session routes must load for MiniStar and sample publisher launch codes.
- Quiz must be visible in the shared event stream without a custom report component.
- The sample remains a local static reporting concept, not a claim of durable analytics.

## Why This Matters

Arcade games like Balloon Pop and Whack-a-Mole can later reuse this selection reporting contract. The plain Quiz route keeps the reporting model stable before Phaser or premium visual layers are introduced.
