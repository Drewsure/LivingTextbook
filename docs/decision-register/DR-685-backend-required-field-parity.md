# DR-685: Backend Required-Field Parity

Status: Accepted

## Decision

Single-entity migration specifications must preserve required schema fields.
Combined multi-entity envelopes may contain conditional optional fields, with
entity-level requiredness deferred to adapter materialization.

## Evidence

- Regression coverage rejects an optional primary tenant field in a single-
  entity migration spec.
- Current combined game-settings migration remains valid and documented as a
  multi-entity envelope.
- Backend storage readiness passes without selecting a provider or enabling
  writes.

This decision is recorded in
`docs/adr/0613-backend-required-field-parity.md`.
