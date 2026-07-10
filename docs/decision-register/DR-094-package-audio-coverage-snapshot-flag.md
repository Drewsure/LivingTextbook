# DR-094: Package Audio Coverage Snapshot Flag

## Decision

Package game/audio coverage write intents must explicitly declare `preservesGameAudioCoverageSnapshot: true`.

## Reason

Game/audio coverage is a release-critical record. It should not be carried only by labels or notes because future hosted and local persistence work must preserve the reviewed assigned game modes, audio-covered modes, cue source decisions, and package version.

## Standard

- Hosted and local package game/audio coverage write intents set the snapshot preservation flag.
- Shared validation fails package game/audio coverage write intents that omit the flag.
- The teacher/admin persistence panel shows whether the snapshot is preserved.
- The flag does not permit raw learner audio, learner recordings, or transcripts in core persistence.
