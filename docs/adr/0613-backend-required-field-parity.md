# ADR-0613: Backend Required-Field Parity

Status: Accepted

## Decision

For a migration candidate with one target schema entity, a migration
specification may not mark a required schema field as optional. Combined
multi-entity migration envelopes may use optional fields for entity-specific
variants, but the eventual adapter must still enforce each target entity's
required fields when materializing a record.

## Why

The platform uses both direct entity records and a few deliberate combined
review envelopes. Strict parity protects ordinary migrations without falsely
rejecting a portable envelope whose fields are conditional across related
entities.

## Guardrails

- Primary keys remain required regardless of target count.
- Evidence records keep their explicit required identity fields.
- Multi-entity optionality is not permission to write incomplete entity
  records; adapters must apply target-entity validation before persistence.
- This is a contract check only; no storage write or adapter selection is
  enabled.

## Consequences

The migration boundary now distinguishes a true weakened field from an
intentional combined envelope. Future multi-entity candidates must document
their conditional fields and preserve entity-level validation in implementation.
