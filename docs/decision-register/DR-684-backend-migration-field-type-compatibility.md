# DR-684: Backend Migration Field Type Compatibility

Status: Accepted

## Decision

Migration specification fields must use either the exact target schema type or
an explicitly approved portable representation. Incompatible field-shape
changes are rejected by backend contract alignment.

## Evidence

- Current sample plans pass using approved identifier, enum, array, JSON, and
  timestamp conversions.
- Regression coverage rejects an integer migration type for a stable-id schema
  field.
- Backend storage readiness passes without selecting a provider or enabling
  storage writes.

This decision is recorded in
`docs/adr/0612-backend-migration-field-type-compatibility.md`.
