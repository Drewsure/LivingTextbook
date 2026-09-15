# ADR 0802: Direct Playback Guard

- Status: accepted
- Date: 2026-09-15
- Scope: immediate term and feedback playback inside canonical games

## Context

Some canonical games announce a selected term or answer result immediately,
outside the visible replay control. Those calls must honor the same reviewed
audio and transcript rules as the visible control.

## Decision

Direct announcements use `playAudioCueText` with an optional reviewed cue. The
shared primitive applies the transcript match guard before playing a source URI;
otherwise it speaks the exact visible text in the resolved target language.

## Consequences

- Term and feedback announcements remain consistent with visible controls.
- A recording with the wrong transcript cannot be played accidentally.
- Audio remains presentation-only and cannot affect scoring, mastery, rewards,
  unlocks, assignments, reports, or microphone approval.

## Verification

```text
npm run verify:canonical-games
npm run typecheck --workspace @living-textbook/web
npm run verify:foundation
```
