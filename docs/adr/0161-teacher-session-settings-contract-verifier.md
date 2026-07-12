# ADR 0161: Teacher Session Settings Contract Verifier

## Status

Accepted

## Context

Teacher session settings now carry several classroom safety rules: learner audio, assist-language support-only behavior, microphone approval, background-media priority, Training Academy recovery, AI Tutor state, and report safety. These rules should not rely only on visual route checks.

## Decision

Add `npm run verify:session-settings` and include it in `npm run verify:foundation`.

## Consequences

- Foundation verification now checks the teacher-session settings contract before typecheck/build.
- Assist-language teacher enablement persistence is protected by an automated source check.
- Future game, audio, reporting, or teacher-control changes get a cheaper early warning when they weaken the session safety model.
- Browser checks remain required for layout and copy review.
