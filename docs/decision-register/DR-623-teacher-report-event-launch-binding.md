# DR-623: Teacher Report Event Launch Binding

Status: Accepted

Decision: Require every teacher report event envelope to carry the requested launch code.

Rationale:

- Teacher reports are scoped to a specific classroom launch.
- Missing or mismatched launch identity can contaminate an otherwise valid report stream.
- The stricter report boundary does not remove reusable pre-launch review streams.

Guardrails:

- Missing `launch_code` blocks report validation.
- A `launch_code` different from runtime `launchCode` blocks report validation.
- Validation is review-only and has no export, persistence, gameplay, scoring, or provider side effect.

Related ADR: `docs/adr/0551-teacher-report-event-launch-binding.md`
