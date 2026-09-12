# ADR-0614: Backend Spec-Level Target Entities

Status: Accepted

## Decision

Migration candidates describe the broader entities involved in an
implementation slice. Migration specifications may additionally declare the
specific schema entities that one materialized record represents. When omitted,
the specification inherits the candidate targets for backward compatibility.

Explicit spec targets must be a non-empty, duplicate-free subset of the
candidate targets. Field, requiredness, and primary-key checks use the
spec-level targets. A primary key that appears on more than one explicit target
is rejected as ambiguous.

## Why

One candidate can cover several related records while its individual specs
remain separate stores. Without spec-level targets, a primary key can appear to
belong to multiple entities and field checks can use the wrong target context.

## Guardrails

- Candidate coverage remains required for implementation planning.
- Explicit spec targets cannot introduce entities absent from the candidate.
- The inherited default preserves existing single-entity specifications.
- This is planning validation only; it does not create tables or write data.

## Consequences

Package release, package/audio coverage, release-control, and game-settings
specs can now describe their materialized record boundaries precisely. Future
multi-entity candidates should add explicit targets before adapter design.
