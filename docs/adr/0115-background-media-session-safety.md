# ADR 0115: Background Media Session Safety

## Status

Accepted

## Context

The product supports optional background media during games, but the core learning rule is audio-first English support. Teacher session settings are the classroom boundary where optional media, reporting, microphone practice, and recovery settings become real choices.

## Decision

Add explicit background media safety fields to `TeacherSessionSettings` and validate them in the shared content model.

## Consequences

- Unsafe session configurations fail validation before pilot use.
- Game implementations have a shared contract for audio-priority behavior.
- Teacher session pages can show background media as enrichment without confusing it with mastery or progression.

