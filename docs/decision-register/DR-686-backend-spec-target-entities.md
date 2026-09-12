# DR-686: Backend Spec-Level Target Entities

Status: Accepted

## Decision

Migration specifications may declare their own target schema entities as a
subset of their candidate's broader targets. Alignment uses those explicit
targets for field, requiredness, and primary-key checks and rejects ambiguous
primary keys.

## Evidence

- Current multi-entity package and settings specs now declare materialization
  targets explicitly.
- Regression coverage rejects an explicitly scoped primary key that appears on
  two target entities.
- Backend storage readiness passes with 109 schema entities, 104 candidates,
  and 103 specifications.
- No adapter, vendor, or live storage write was enabled.

This decision is recorded in
`docs/adr/0614-backend-spec-target-entities.md`.
