# ADR 0789: Explicit Audio Scope

## Status

Accepted

## Decision

The shared game audio coverage contract counts a cue only when it matches the
requested unit, target language, and explicit game-mode scope. Cues without a
`gameMode` remain reusable across modes within the unit; cues with a different
explicit mode are excluded from coverage.

## Rationale

Without this rule, a package could accidentally pass a current game's audio
gate using a cue intended for another game. That weakens evidence integrity and
can produce the wrong spoken instruction or vocabulary prompt. Applying one
scope rule to terms, sentences, and instructions keeps content review and
runtime behavior aligned.

## Consequences

- Incorrectly scoped cues produce a visible audio-review state.
- Generic unit-scoped cues remain efficient for white-label packages.
- Explicit mode-specific assets remain precise and auditable.
- This foundation change does not enable live services or promote external
  Phaser source.
