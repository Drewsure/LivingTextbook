# Quiz Selection Playable Slice

## Purpose

Quiz is the first playable selection parent-engine slice. It proves selected-response assessment before arcade selection skins such as Balloon Pop, Whack-a-Mole, Airplane, or Maze Chase are promoted.

## Current Implementation

- Adds `/quiz/[code]` for MiniStar and sample publisher launch codes.
- Uses the existing selection preview adapter to create deterministic vocabulary and sentence rounds.
- Shows one reviewed question at a time.
- Supports tap-to-hear instructions, prompt text, answer options, and feedback.
- Emits standard game events through the local progression adapter:
  - `round_shown`
  - `answer_submitted`
  - `answer_result`
  - `mastery_updated`
  - `game_completed`
- Uses `selection-assessment-v1` scoring.
- Updates local progression and session summary after completion.
- Exposes Quiz as a ready optional game in the sample unit game offer map.

## Standards Preserved

- No random rewards.
- No AI-generated questions inside the student game.
- No support-language-only progression.
- No canvas-only text controls.
- No premium polish before the engine contract is usable.

## Next Integration Step

If the route holds up in browser checks, the same selection event contract can be used as the control spine for arcade skins built later by Z.ai or another isolated prototyping agent.
