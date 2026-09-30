# ADR 1316: Tenant-Empty Private Library Boundary

## Status

Accepted for the white-label pilot foundation.

## Decision

The tenant-scoped private library route must resolve its own tenant shell and
show an explicit empty state when that tenant has no library preview records.
It must not reject a new tenant merely because the Sample Publisher reference
library has no matching record, and it must not copy reference-tenant content
into the new tenant.

Public community sharing, cross-tenant remixing, student-data copying, and
unreviewed assignment remain blocked.

## Consequences

- A publisher can reach its private library workspace before any package is
  imported, without seeing another tenant's content.
- The route is now suitable for the first step of a saleable white-label
  onboarding flow.
- Real library persistence and role authorization remain future gates.
