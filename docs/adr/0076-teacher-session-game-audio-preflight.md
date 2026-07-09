# ADR 0076: Teacher Session Game Audio Preflight

## Status

Accepted

## Context

Package game/audio coverage is now represented in readiness, publish gates, persistence intents, migration specs, and schema draft records. Teacher session preflight still needed a launch-level check.

## Decision

Add an `assigned-game-audio` preflight check that compares the session's assigned game modes with package audio-covered game modes.

## Consequences

Teachers can see whether assigned game paths are audio-covered before pilot use. This keeps audio-first learning visible at the classroom launch layer without adding backend coupling.
