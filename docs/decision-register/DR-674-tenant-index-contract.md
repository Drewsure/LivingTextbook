# DR-674: Tenant Index Contract

Status: Accepted

## Decision

Schema entities with `tenant_id` and migration specs whose tenant scope names
`tenant_id` require a tenant-aware index.

## Rationale

- Tenant-aware access paths are needed for safe, efficient white-label reads.
- Hosted and closed/local stores should preserve the same scoped lookup shape.
- The rule makes tenant isolation reviewable before vendor implementation.

## Guardrails

- This does not enable live persistence or select a backend vendor.
- Index presence does not authorize cross-tenant access or live writes.

## Evidence

- All current tenant-scoped specs and schema entities have tenant-aware
  indexes.
- Regression coverage rejects missing tenant indexes at both layers.

This decision is recorded in
`docs/adr/0602-tenant-index-contract.md`.
