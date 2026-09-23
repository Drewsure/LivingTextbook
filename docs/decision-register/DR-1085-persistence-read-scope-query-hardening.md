# DR-1085: Persistence Read-Scope Query Hardening

Decision: Persistence read routes must use shared bounds for tenant-scoped
query identities and operation-history limits before authorization or storage.

Rationale: Tenant isolation is not only an authorization concern; unbounded
query inputs can create resource pressure and inconsistent scope handling.

Scope: Progression, event, status, operation-evidence, and local-handoff read
routes. The rule applies to future persistence GET routes.

Verification: `scripts/verify-persistence-read-authorization.mjs` checks the
shared helpers and every current route. The persistence runtime and foundation
gates must pass.
