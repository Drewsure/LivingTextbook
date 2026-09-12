# ADR-0616: Backend Candidate Target Coverage

Status: Accepted

## Decision

Every non-deferred migration candidate must have migration-spec coverage for
each target schema entity it declares. A specification's explicit
`targetEntities` list contributes coverage; a legacy single-entity or
multi-entity spec without an explicit list inherits the candidate targets
under the existing compatibility rules.

Deferred candidates may remain without specs and therefore without coverage.

## Why

Candidate plans are implementation commitments, not just headings. Without
coverage validation, a candidate could claim publish gates, approval ledgers,
or other durable records while only defining a derived summary record.

## Guardrails

- Coverage does not require one spec per entity when a documented combined
  record intentionally materializes several entities.
- Explicit spec targets must remain a subset of candidate targets.
- A covered target still must pass field, type, requiredness, tenant, policy,
  and lifecycle checks.
- This remains vendor-neutral and side-effect free.

## Consequences

The release-control candidate now includes separate publish-gate and approval-
ledger specifications alongside its derived candidate summary. Future backend
work cannot silently omit a declared durable record.
