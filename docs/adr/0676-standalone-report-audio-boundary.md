# ADR 0676: Standalone Report Audio Boundary

## Decision

Standalone `audio_requested` evidence remains support-only in the teacher report
runtime. The direct canonical-game report helper returns no game-evidence
errors when the supplied events contain audio requests only.

## Rationale

Learner audio is required across the platform, but listening must not create a
game attempt, mastery result, Star Dust award, or completion report. Keeping
the report helper aligned with the grouped evidence model prevents normal
tap-to-speak activity from appearing as a failed game.

## Consequences

- Audio engagement remains visible through support/media reporting lanes.
- A game report still requires canonical learning events and completion
  evidence.
- No persistence, export, or progression behavior is enabled by this change.
