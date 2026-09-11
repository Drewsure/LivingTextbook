# DR-665: Durable Evidence Scope Boundary

Status: Accepted

## Decision

Evidence packet and evidence attachment records preserve explicit
`scope_kind` values of `platform` or `tenant` in schema drafts, migration
specifications, and durable persistence contracts.

## Rationale

- Human-readable scope labels are not enough for storage queries or export
  isolation.
- Shared review infrastructure and tenant-owned evidence need different
  ownership semantics even when they share a packet shape.
- The same scope vocabulary supports hosted and local deployments.

## Guardrails

- Scope does not authorize upload, storage writes, approval, promotion, or
  student-facing use.
- Invalid or missing scope keeps the evidence contract blocked.
- Tenant filtering and release-control policy remain required independently.

## Evidence

- Shared `reviewSurfaceScope` validator.
- Evidence packet and attachment schema fields.
- Migration specification fields and scope-aware tenant boundaries.
- Persistence validator and runtime regression coverage.
