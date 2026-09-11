# DR-620: Progress Event Stream Context

Status: Accepted

Decision: Require progress-event streams to remain within one unit and launch identity whenever those fields are present, while allowing multiple learner sessions in a class-scoped report.

Rationale:

- Individually valid events can still contaminate a report or persistence batch when units or launches are mixed.
- Teacher reports may legitimately aggregate multiple learner sessions under one classroom launch.
- Multiple modes within one unit remain a legitimate learning path.
- Context checks protect future adapters at low cost.

Guardrails:

- Multiple modes are allowed within one canonical unit.
- Multiple unit keys or launch codes block validation.
- Multiple student session IDs remain allowed within one launch-scoped teacher report.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0548-progress-event-stream-context.md`
