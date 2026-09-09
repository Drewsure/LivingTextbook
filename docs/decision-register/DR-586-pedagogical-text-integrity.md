# DR-586: Pedagogical Text Integrity

Status: Accepted

Decision: Reject blank and duplicate vocabulary terms and blank target sentence structures at shared content and AI authoring boundaries.

Guardrails:

- Terms are trimmed and compared case-insensitively.
- Blank terms and sentences are rejected.
- 8-12 terms and exactly 2 sentence structures remain canonical.
- Validation has no provider or student-state side effects.
