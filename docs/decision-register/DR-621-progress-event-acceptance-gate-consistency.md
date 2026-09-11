# DR-621: Progress Event Acceptance Gate Consistency

Status: Accepted

Decision: Require progress-event streams to use one `event_acceptance_gate_id` value.

Rationale:

- The gate binds evidence to a reviewed session and policy boundary.
- Matching unit and launch identities are not enough when evidence comes from different gate decisions.
- Class reports may still contain multiple modes and learner sessions inside one gate.

Guardrails:

- Mixed gate IDs block stream validation.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0549-progress-event-acceptance-gate-consistency.md`
