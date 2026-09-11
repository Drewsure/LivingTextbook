# DR-620: Progress Event Stream Context

Status: Accepted

Decision: Require progress-event streams to remain within one unit, launch, and student-session identity whenever those fields are present.

Rationale:

- Individually valid events can still contaminate a report or persistence batch when contexts are mixed.
- Multiple modes within one unit remain a legitimate learning path.
- Context checks protect future adapters at low cost.

Guardrails:

- Multiple modes are allowed within one canonical unit.
- Multiple unit keys, launch codes, or student session IDs block validation.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0548-progress-event-stream-context.md`
