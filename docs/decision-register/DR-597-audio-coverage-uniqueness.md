# DR-597: Audio Coverage Uniqueness

Status: Accepted

Decision: Reject repeated cue IDs within one audio coverage group while allowing deliberate reuse across separate coverage groups.

Guardrails:

- Vocabulary, sentence, instruction, feedback, and each game-mode array must be internally unique.
- Cross-group reuse remains allowed.
- Duplicate package cue IDs remain rejected separately.
- No provider, storage, playback, release, or student-state side effect is introduced.

Recorded in `docs/adr/0526-audio-coverage-uniqueness.md`.

