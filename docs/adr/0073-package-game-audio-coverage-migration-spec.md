# ADR 0073: Package Game/Audio Coverage Migration Spec

## Status

Accepted

## Context

Game/audio coverage is now visible in readiness and named in persistence adapter write intents. Migration specs needed the matching vendor-neutral record shape.

## Decision

Add `spec-package-game-audio-coverage` to backend migration specs and include coverage metadata in the package release candidate.

## Consequences

Backend planning now preserves assigned game modes, audio-covered modes, and cue source summaries as release metadata.
