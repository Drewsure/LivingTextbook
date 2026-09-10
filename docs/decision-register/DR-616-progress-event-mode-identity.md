# DR-616: Progress Event Mode Identity

Status: Accepted

Decision: Require progress-event envelopes to use a supported shared `GameModeId` from the content-model catalog.

Rationale:

- Telemetry must remain aligned with curated catalog, engine, scoring, audio, and reporting contracts.
- A non-empty unknown mode could create an unreviewed evidence lane.
- A shared helper prevents a second telemetry-only allowlist from drifting.

Guardrails:

- Unknown and retired mode IDs block envelope validation.
- Catalog changes require dependent contract and runtime verification updates.
- The guard remains review-only and does not enable gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0544-progress-event-mode-identity.md`
