# DR-678: Backend Definition Auditability Contract

Status: Accepted

## Decision

The backend alignment validator now requires non-empty definition metadata,
relationship notes, and field notes across the schema and migration plans.

## Rationale

- White-label adapters need an explicit meaning for every stored field.
- Relationship and migration notes make hosted/local parity reviewable.
- Documentation is part of the backend contract, not a later polish step.

## Evidence

- Current schema and migration plans pass the auditability checks.
- Regression coverage rejects missing schema and migration field notes.

This decision is recorded in
`docs/adr/0606-backend-definition-auditability-contract.md`.
