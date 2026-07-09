# ADR 0075: Package Game/Audio Coverage Publish Gate

## Status

Accepted

## Context

Game/audio coverage has been added to package readiness, persistence write intents, migration candidates, migration specs, and the backend schema draft. The package publish gate still needed to name audio coverage per assigned game mode as an explicit release blocker.

## Decision

Add a `game-audio-coverage` gate under the games domain.

## Consequences

Pilot release decisions now require reviewed audio coverage or approved fallback for every assigned game mode. This keeps audio-first learning central without adding premium polish or backend coupling.
