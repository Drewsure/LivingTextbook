# ADR 0077: Teacher Assignment Game Audio Coverage

## Status

Accepted

## Context

Game/audio coverage was visible at package readiness, publish gate, schema, migration, persistence, and session preflight layers. Teacher assignment readiness still only displayed target game modes.

## Decision

Add `audioCoveredGameModes` to teacher assignment plans and show coverage beside assigned game paths.

## Consequences

Teachers can see whether assigned game modes are audio-covered before launch. Ready-for-pilot assignment validation now blocks missing game audio coverage.
