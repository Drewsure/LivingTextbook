# ADR 0648: Speak It Canonical Integration

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Speak It is promoted into the canonical DOM game integration set. It must use
the shared route shell and progression adapter, emit the canonical event
sequence, record prompt audio requests, and carry deterministic replay and
tenant/session identity. Local microphone record/replay remains an optional
teacher-approved enhancement.

## Rationale

Audio is a first-class learning channel for young and emerging English
learners. Speak It already supported tap-to-hear prompts and optional local
record/replay, but its prompt audio was not represented in the shared evidence
stream and the route had no canonical start event. This promotion makes speech
practice consistent with the other game families without introducing paid AI
speech scoring or student audio storage.

## Boundaries

- Learner completion remains a self-confirmed spoken practice action in the
  core mode.
- Microphone access is controlled by teacher and tenant policy.
- No transcript generation, cloud recording, or AI Tutor call is enabled.
- Audio requests never grant mastery, rewards, or unlocks.
- No Phaser source was imported or promoted.
