# DR-709: Balloon Pop Controlled Integration

**Date:** 2026-09-12  
**Decision:** Accept the canonical DOM Balloon Pop slice as the second controlled game integration.

## Evidence

- Route: `/balloon/demo-unit-1`
- Incorrect selection recorded answer evidence without progress.
- Correct retry advanced through all reviewed rounds.
- Final state: `3/3` correct pops, complete status, `300 Star Dust`.
- Event sequence observed: `game_started`, `round_shown`, `audio_requested`, `answer_submitted`, `answer_result`, `mastery_updated`, `game_completed`.
- Web typecheck, prototype-review verification, and live browser interaction passed.

## Boundaries

- No direct Phaser source import.
- No timer-only, support-language-only, or audio-only progress trigger.
- No direct reward inventory or student identity write from the game component.
- Phaser motion and timing remain review-only until evidence is mapped to this contract.

## Next decision point

Compare the frozen Phaser Balloon Pop implementation against this verified controlled slice and the Memory Match wrapper boundary before approving any source adoption.
