# DR-585: Audio Cue Semantic Coverage

Status: Accepted

Decision: Reject audio plans that use sentence cues for vocabulary coverage or non-sentence cues for sentence coverage.

Guardrails:

- Required vocabulary coverage uses `term` cues.
- Required sentence coverage uses `sentence` cues.
- Validation runs before release and student-facing use.
- Review-only behavior remains side-effect free.
