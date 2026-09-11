# DR-666: Adapter Evidence Scope Boundary

Status: Accepted

## Decision

Hosted and local evidence write intents must preserve durable scope_kind values
of platform or tenant. Missing scope is invalid, and a scope mismatch between
the durable record and adapter intent blocks alignment.

## Rationale

- Adapter plans must not erase ownership boundaries present in the schema.
- Hosted and local deployments need equivalent isolation semantics.
- Cross-layer validation is cheaper and safer before vendor implementation.

## Guardrails

- Scope alignment does not enable live writes.
- Upload, approval, promotion, download, and student-facing use remain
  independently blocked.
- Tenant-specific adapters must declare scope intentionally.

## Evidence

- Hosted and local evidence write intents carry scopeKind.
- Adapter validation rejects missing scope.
- Persistence alignment rejects mismatched durable and adapter scope.
- Runtime regression coverage exercises both failure paths.
