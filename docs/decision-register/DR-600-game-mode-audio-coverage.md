# DR-600: Game-Mode Audio Coverage

Status: Accepted

Decision: Restrict game-mode audio coverage to supported curated modes and learner-facing cue kinds, while rejecting conflicting cue-level game-mode metadata.

Guardrails:

- Coverage keys must be supported game modes.
- Term, sentence, instruction, and feedback cues are allowed in gameplay coverage.
- UI-label and story-line cues remain outside gameplay coverage.
- Declared cue mode must match the coverage lane when present.
- Undeclared cues may be deliberately reused across modes.
- No live provider, storage, playback, release, assignment, or student-state behavior is introduced.

Related records: `docs/adr/0529-game-mode-audio-coverage.md`, `docs/PRINCIPLES_AND_STANDARDS.md` section 71.
