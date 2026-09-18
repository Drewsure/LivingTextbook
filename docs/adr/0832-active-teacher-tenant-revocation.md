# ADR 0832: Active Teacher Tenant Revocation

## Status

Accepted for foundation hardening.

## Context

Teacher review cookies are signed and expiring, but a deployment can remove a
tenant from its active allowlist before those cookies expire. Continuing to
accept the cookie would preserve access beyond current tenant policy and would
be unsafe for a white-label platform.

## Decision

Re-check `isTeacherTenantAllowed` when reading teacher session status and when
authorizing tenant-scoped persistence operations. Keep the response generic so
revoked and never-authorized tenants cannot be distinguished through the
browser.

## Consequences

- Tenant removal takes effect immediately for this closed-pilot bridge.
- Cookie expiry and signature validation remain necessary but are no longer
  the complete authorization decision.
- Future identity and service-token work must preserve the same active tenant
  policy boundary.
