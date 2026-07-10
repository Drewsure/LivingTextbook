# ADR 0094: Package Audio Coverage Snapshot Flag

## Status

Accepted

## Context

The platform already names package game/audio coverage in schema, migration, publish-gate, and persistence plans. The persistence write intents included the requirement in prose, but future backend work needs a machine-readable guarantee.

## Decision

Add `preservesGameAudioCoverageSnapshot` to persistence write intents, require it for package game/audio coverage write intents, set it in hosted and local sample adapter plans, and display it in the persistence readiness panel.

## Consequences

Backend implementation can map package game/audio coverage snapshots with less ambiguity. The requirement remains backend-agnostic and continues to forbid raw learner audio and transcripts in core storage.
