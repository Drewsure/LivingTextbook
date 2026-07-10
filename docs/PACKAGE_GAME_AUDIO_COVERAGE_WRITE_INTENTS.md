# Package Game/Audio Coverage Write Intents

## Purpose

Persistence adapter plans now include write intents for package game/audio coverage snapshots. This protects reviewed releases from drifting after approval.

## Current Implementation

- Hosted pilot adapter includes `hosted-package-audio-coverage-write`.
- Local classroom adapter includes `local-package-audio-coverage-write`.
- Both intents reject raw learner audio and transcripts.
- Both intents are required before pilot use.
- Both intents set `preservesGameAudioCoverageSnapshot: true`.
- The shared content model rejects package game/audio coverage write intents that omit the snapshot preservation flag.

## Stored Shape To Preserve

Future hosted or local storage must preserve:

- assigned game modes,
- audio-covered game modes,
- cue source decisions,
- reviewed package version,
- release/rollback relationship where applicable.

## Boundary

This does not choose a backend and does not store real data yet. It only makes the write requirement visible before backend migration work begins.
