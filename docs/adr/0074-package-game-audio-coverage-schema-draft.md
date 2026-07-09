# ADR 0074: Package Game/Audio Coverage Schema Draft

## Status

Accepted

## Context

Package game/audio coverage is already represented in readiness, persistence write intents, migration candidates, and migration specs. The backend schema draft was behind those layers.

## Decision

Add `package_game_audio_coverage` to the vendor-neutral backend schema draft.

## Consequences

The first pilot backend comparison now includes assigned game modes, audio-covered modes, audio gap counts, and metadata-only storage rules before any vendor-specific implementation begins.
