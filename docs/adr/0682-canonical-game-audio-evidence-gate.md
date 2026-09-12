# ADR 0682: Canonical Game Audio Evidence Gate

## Status

Accepted

## Context

The Living Textbook platform requires learner-facing game text to remain
audio-supported. Component checks already require current canonical games to
call the shared audio event adapter, but a runtime completion stream could
still be accepted without any `audio_requested` evidence.

That gap would allow a future DOM, canvas, or Phaser wrapper to complete a game
while omitting the audio pathway. It would also make teacher evidence unable
to distinguish a genuinely audio-supported attempt from a visually similar
attempt.

## Decision

The shared canonical game event validator requires at least one
`audio_requested` event in every accepted game attempt. The event must still
carry the existing replay, tenant, identity, and support-only safeguards.
Audio evidence does not unlock a mode, grant mastery, award Star Dust, or
replace answer activity.

## Consequences

- Every promoted game must demonstrate an audio request before completion.
- Missing audio evidence pauses progression and Star Dust at the shared
  completion gate.
- Existing canonical game slices remain compatible because they already emit
  audio requests through the shared adapter.
- Future wrappers must implement the audio contract before integration review;
  Phaser or other visual technology does not change this requirement.

## Verification

- Runtime behavior includes a valid sequence and a rejected sequence with
  missing audio evidence.
- Canonical integration verification checks the shared validator marker and
  all current game components continue to require the shared audio adapter.
