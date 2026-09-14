# ADR 0782: Game Audio Readiness Route Gate

## Status

Accepted

## Decision

The reusable playable game route shell will block gameplay and scoring until
the current unit has target-language audio coverage for every vocabulary term,
every target sentence, and at least one instruction cue for the current game
mode. Coverage is calculated by the shared `packages/content-model` contract,
not independently by each game.

Missing coverage is a package readiness issue. The student receives an
audio-review message and a safe route back to the curated activity hub; no
completion, mastery, or reward evidence is produced while the gate is active.

## Rationale

The platform serves early readers and learners who may not yet read English.
Audio is therefore a prerequisite for usable gameplay, not decorative polish.
A shared gate prevents different game modes or white-label tenants from
quietly applying different standards. It also keeps approved browser
text-to-speech available as a cue source without allowing unreviewed,
wrong-language, or cross-unit content to pass.

## Consequences

- Content packages must provide mode-aware instruction cues alongside term and
  sentence coverage.
- Teacher review surfaces can distinguish missing package evidence from student
  performance.
- Future recorded, partner-provided, or tenant-provided audio can use the same
  contract without changing game engines.
- This remains a readiness gate only; it does not activate uploads, live AI
  generation, persistence, or Phaser source promotion.
