# DR-617: Progress Event Unit Identity

Status: Accepted

Decision: Require progress-event envelopes to use the canonical tenant, curriculum, level, and unit key format.

Rationale:

- Reports, replay, migration, and hosted/local reconciliation need one stable content-unit identity.
- A generic unit label could disconnect evidence from the reviewed curriculum package.
- The shared canonical key contract preserves white-label boundaries.

Guardrails:

- Levels remain 1 through 8 and unit numbers remain positive integers.
- Tenant and curriculum segments are non-empty and cannot contain structural separators or whitespace.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0545-progress-event-unit-identity.md`
