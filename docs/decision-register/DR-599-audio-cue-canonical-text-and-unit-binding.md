# DR-599: Audio Cue Canonical Text And Unit Binding

Status: Accepted

Decision: Require vocabulary and sentence audio cues to match canonical unit text, and require every cue referenced by a unit audio plan to be explicitly bound to that unit.

Rationale:

- Correct language and cue kind do not prove that the recording teaches the intended word or sentence.
- Cross-unit cue references can make a package appear complete while delivering incorrect learner content.
- Deterministic text and unit checks protect teacher review and future game engines without coupling the model to a provider or storage system.

Guardrails:

- Vocabulary cues match canonical vocabulary terms after whitespace and case normalization.
- Sentence cues match canonical target sentences after whitespace and case normalization.
- Every referenced learner-facing cue uses the same unit key as its audio support plan.
- Instruction and feedback cues remain kind-checked and unit-bound.
- No live provider, storage, release, assignment, playback, or student-state behavior is introduced.

Related records: `docs/adr/0528-audio-cue-canonical-text-and-unit-binding.md`, `docs/PRINCIPLES_AND_STANDARDS.md` section 70.
