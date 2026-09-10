# DR-619: Progress Event Type Identity

Status: Accepted

Decision: Require progress-event envelopes and taxonomy registries to use the reviewed shared event taxonomy categories.

Rationale:

- Runtime JSON must not invent an evidence event through an arbitrary name.
- An effect label alone is insufficient without a known event contract.
- Existing event categories provide one runtime identity source.

Guardrails:

- Unknown event types block registry and envelope validation.
- New events require coordinated type, taxonomy, visibility, persistence, and runtime verification updates.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0547-progress-event-type-identity.md`
