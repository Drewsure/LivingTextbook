# ADR 0072: Package Game/Audio Coverage Write Intents

## Status

Accepted

## Context

Package readiness now tracks assigned game modes and audio-covered modes. Persistence adapter plans did not yet identify those as durable release metadata.

## Decision

Add hosted and local package game/audio coverage snapshot write intents.

## Consequences

Backend migration work must preserve reviewed game/audio coverage metadata without storing raw learner audio or transcripts.
