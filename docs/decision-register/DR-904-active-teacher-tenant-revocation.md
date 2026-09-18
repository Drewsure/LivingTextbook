# DR-904: Active Teacher Tenant Revocation

## Decision

Revalidate the deployment's current teacher tenant allowlist on every teacher
session status read and every tenant-scoped teacher operations read. A signed
cookie proves integrity and expiry, but it does not override current tenant
policy.

## Included

- Revocation of existing teacher sessions when a tenant leaves the active
  allowlist.
- Identical privacy-safe unauthorized behavior for session status and
  persistence operations.
- Source verification for the authorization helper and session route.

## Excluded

- A production identity provider, tenant administration UI, or browser-visible
  credential management.
- Broadening server-only persistence token authority.

See ADR 0832 and
`docs/verification/TEACHER_OPERATIONS_AUTHORIZATION_CHECKS.md`.
