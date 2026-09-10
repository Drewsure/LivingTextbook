# DR-598: Audio Cue Semantic Coverage

Status: Accepted

Decision: Enforce semantic cue kinds for vocabulary, sentence, instruction, and feedback coverage lanes.

Guardrails:

- Vocabulary arrays require term cues.
- Sentence arrays require sentence cues.
- Instruction arrays require instruction cues.
- Feedback arrays require feedback cues.
- Game-mode arrays may combine relevant cue kinds.
- Missing, wrong-language, duplicate, and cross-tenant cue errors remain separate checks.

Recorded in `docs/adr/0527-audio-cue-semantic-coverage.md`.

