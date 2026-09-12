# DR-680: Backend Migration Field Extension Contract

Status: Accepted

## Decision

Backend migration specs must use fields declared by their target schema entity
or by an explicit, documented `migrationFieldExtensions` entry. Extension
fields are validated for identity, type, requiredness, notes, entity scope,
and duplicate names.

## Rationale

- Release and revision metadata must remain aligned across hosted and local
  storage designs.
- A migration spec should not invent a field that the canonical schema cannot
  explain.
- The persistence workbench needs to show these materialized fields clearly
  before any vendor implementation is selected.

## Evidence

- The sample schema declares the materialized fields required by the current
  migration specifications.
- Backend contract regression coverage rejects an unknown migration field.
- Backend storage verification passes all 109 entities, 104 candidates, and
  103 specifications.
- No live storage write or backend vendor selection was enabled.

This decision is recorded in
`docs/adr/0608-backend-migration-field-extension-contract.md`.
