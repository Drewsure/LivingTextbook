# ADR 0791: Mode-Scoped Instruction Audio

## Status

Accepted

## Decision

When a unit audio support plan declares a game-mode mapping, runtime coverage
must count instruction cues only from the plan's shared instruction list or
that mode's reviewed cue list. A cue that merely shares the unit and language
is not sufficient evidence for mode instruction readiness.

## Rationale

Instructions are learner-facing text and can vary materially by activity.
Counting any same-unit instruction cue could open a game with the wrong spoken
directions, even when vocabulary and sentence coverage are correct. The
support plan is already the review authority for scoped learner audio, so the
instruction family must obey the same boundary.

## Consequences

- Existing packages with explicit mode instruction entries continue to open.
- A package with an omitted mode instruction entry remains audio-blocked until
  its review manifest is corrected.
- Generic shared instructions remain reusable when listed in
  `instructionAudioCueIds`.
- This does not enable uploads, live AI, persistence, assignment, or Phaser
  promotion.
