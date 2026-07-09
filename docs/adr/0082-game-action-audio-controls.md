# ADR 0082: Game Action Audio Controls

## Status

Accepted

## Context

Audio-first game standards require text, prompts, feedback, and critical controls to be listenable. Quiz and Sentence Builder had audio support for most text surfaces, but submit/reset actions were plain buttons.

## Decision

Replace critical learner-facing game action buttons with `AudioSupportedAction`.

## Consequences

Critical controls now include a separate listen/replay control. This aligns the playable game slices with the audio-first standard without changing scoring or layout architecture.
