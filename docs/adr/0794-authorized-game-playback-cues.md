# ADR 0794: Authorized Game Playback Cues

## Status

Accepted

## Decision

Canonical game routes must use the shared content-model cue selector for both
audio readiness and the cue list handed to gameplay components. The selector
requires the active unit key, tenant owner, target language, and reviewed
game-mode scope; when a mode manifest exists, instruction cues also require
shared or mode-specific authorization.

## Rationale

Readiness alone is insufficient if gameplay can still search a broad package
cue list. That could expose a different tenant's recording, a support-language
cue, or an instruction from another game. One selector keeps what opens and
what plays identical and gives future Phaser wrappers a single boundary.

## Consequences

- Direct routes and dynamic launch flows receive only authorized cues.
- Existing valid sample gameplay remains unchanged.
- Future game adapters must consume the selector rather than package-wide
  language filtering.
- This does not enable uploads, live AI, persistence, assignment, or Phaser
  promotion.
