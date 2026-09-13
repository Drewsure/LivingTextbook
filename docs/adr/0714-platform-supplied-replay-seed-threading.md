# ADR 0714: Platform-Supplied Replay Seed Threading

- Status: Accepted
- Date: 2026-09-14
- Decision owner: Codex architecture review

## Context

Canonical game evidence requires one identical deterministic replay seed across
game lifecycle and learning-audio events. The adapter already allowed a
platform-supplied seed when creating `game_started`, but the later interaction,
audio, and completion factories derived a new seed from unit and mode. That
worked for current demo callers but would reject a future Phaser wrapper that
uses a launch-scoped seed.

## Decision

Add an optional `replaySeed` argument to the interaction, audio, and completion
factories. Each factory preserves the supplied value and falls back to the
existing deterministic unit-and-mode seed when the argument is omitted.

## Consequences

- Future game wrappers can bind all evidence to one platform-issued replay.
- Existing callers remain source-compatible and deterministic.
- Runtime verification now compiles the adapter and tests the supplied seed
  across start, interaction, audio, and completion events.
- This does not authorize source import, live persistence, or candidate
  promotion; it only makes the canonical event boundary compatible.
