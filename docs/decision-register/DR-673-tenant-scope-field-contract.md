# DR-673: Tenant Scope Field Contract

Status: Accepted

## Decision

Any migration spec whose tenant scope names `tenant_id` must declare a required
`tenant_id` field.

## Rationale

- Tenant isolation cannot rely on prose or indexes alone.
- Hosted and closed/local white-label deployments need one explicit ownership
  field.
- Explicit scope makes export, rollback, and policy review auditable.

## Guardrails

- This does not enable live persistence or select a backend vendor.
- Platform-only records remain allowed to omit tenant_id when their scope does
  not require it.
- Upload, approval, promotion, download, and student-facing use remain behind
  their existing gates.

## Evidence

- Added tenant_id to 96 previously incomplete tenant-scoped migration specs.
- Regression coverage rejects a media spec whose tenant_id is removed.

This decision is recorded in
`docs/adr/0601-tenant-scope-field-contract.md`.
