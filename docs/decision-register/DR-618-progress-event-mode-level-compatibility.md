# DR-618: Progress Event Mode-Level Compatibility

Status: Accepted

Decision: Require progress-event envelopes to use a mode supported at the level encoded in their canonical unit key.

Rationale:

- A valid mode and valid unit can still describe an impossible curriculum pathway when their level contracts disagree.
- Event evidence must align with the curated mode contract used by unit validation and activity pathways.
- Shared catalog reuse prevents telemetry compatibility drift.

Guardrails:

- The level is read from the canonical unit key.
- Valid-but-unavailable combinations block envelope validation.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0546-progress-event-mode-level-compatibility.md`
