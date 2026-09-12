# ADR-0601: Tenant Scope Field Contract

Status: Accepted

## Decision

Every migration specification whose `tenantScope` requires `tenant_id` must
declare a required `tenant_id` field in its record shape.

The backend contract alignment validator checks this before a migration is
treated as coherent.

## Why

Tenant ownership written only in prose or an index description is not enough to
protect white-label data. Hosted and closed/local stores need an explicit
tenant boundary in the record contract so queries, exports, rollback, and
policy checks can preserve isolation.

## Guardrails

- This is a contract check only; it does not select a database vendor or enable
  live persistence.
- The tenant field does not authorize uploads, approval, promotion, download,
  or student-facing use.
- Platform-scoped records may omit tenant_id only when their tenantScope does
  not require it.

## Consequences

Tenant-scoped migration specifications now carry the same explicit ownership
boundary expected by the white-label platform. The sample plan includes this
field for all 96 previously incomplete tenant-scoped specs.
