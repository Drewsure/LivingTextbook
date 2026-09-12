# ADR-0611: Backend Field Type Vocabulary

Status: Accepted

## Decision

The vendor-neutral backend contract has one explicit field-type vocabulary.
Schema fields, migration-only extension fields, and migration specification
fields must use a supported type before they can participate in alignment.

The vocabulary includes the current platform types such as `string`,
`boolean`, `integer`, `number`, `timestamp`, `datetime`, `json`, arrays,
stable identifiers, route values, roles, enums, and coded strings. Provider-
specific types are not valid at this boundary.

## Why

Hosted, local, and hybrid adapters must interpret the same contract
consistently. A free-text type label could allow a provider-specific shape to
leak into the white-label boundary and make migration or export behavior
diverge between deployments.

## Guardrails

- This validates field metadata only; it does not choose a database provider.
- Adding a new type requires an explicit vocabulary update, regression case,
  and documentation update.
- Type approval does not authorize storage writes, learner-data collection,
  report export, or package publication.
- Migration-only fields remain visible and auditable as extensions rather than
  silently widening the base schema.

## Consequences

Backend contract drift now fails before adapter design. Future provider
adapters must map from this vocabulary deliberately and document any lossless
conversion or export constraint.
