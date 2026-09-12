# ADR-0602: Tenant Index Contract

Status: Accepted

## Decision

Every schema entity that declares `tenant_id` and every migration specification
whose `tenantScope` requires `tenant_id` must declare at least one tenant-aware
index.

The backend contract alignment validator checks both layers before storage
implementation is treated as coherent.

## Why

Tenant ownership in a field is necessary but not sufficient for a practical
white-label backend. A tenant-aware access path supports efficient scoped reads,
reports, exports, rollback, and isolation checks in hosted and closed/local
deployments.

## Guardrails

- This is a contract check only; it does not select a database vendor or enable
  live persistence.
- An index does not authorize cross-tenant access or student-facing writes.
- Upload, approval, promotion, download, and student-facing use remain
  independently gated.

## Consequences

Future schema and migration authors must provide both the ownership field and a
tenant-aware access path. The current sample plan already satisfies the rule.
