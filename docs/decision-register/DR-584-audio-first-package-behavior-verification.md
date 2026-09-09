# DR-584: Audio-First Package Behavior Verification

Status: Accepted

Decision: Require unit audio support plans to declare and preserve the learner-facing target language before package or runtime readiness can be considered valid.

Guardrails:

- Missing plans are rejected.
- Required plans cover every vocabulary term and target sentence.
- Referenced cues must exist and match the plan language.
- Runtime target-language mismatches are rejected.
- Review-only execution remains side-effect free.
