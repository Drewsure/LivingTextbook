# ADR 1318: Bind Quarantine Service Credentials to Explicit Tenants

## Status

Accepted and implemented on 2026-09-30.

## Context

The publisher intake and quarantine review APIs support an optional
machine-to-machine bearer credential for controlled rehearsal and future
hosted operations. A credential that is valid for the whole deployment must
not become authority to write or review any tenant named by the caller.

## Decision

Keep the bearer credential as an operational convenience, but require the
deployment to bind it to the comma-separated
`LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS` environment setting.
Tenant-scoped intake and review authorization succeeds only when the exact
tenant appears in that allowlist. Same-origin teacher authorization remains
tenant-scoped and unchanged.

The credential-only check may still bypass the CSRF/origin preflight for
machine-to-machine requests, but it is never sufficient for a tenant-scoped
read or write. All upload quarantine review routes use the shared helper.

## Consequences

- A publisher pilot can use a service credential without granting cross-tenant
  upload or review access.
- A missing or empty allowlist fails closed for service-token operations.
- Existing local teacher flows continue to use their tenant-scoped session
  authorization.
- Pilot deployment configuration must name every tenant intentionally; adding a
  tenant becomes an explicit operations change.

## Verification

`npm run verify:upload-quarantine-intake` and
`npm run verify:publisher-intake-rehearsal` must prove both the allowed tenant
path and a rejected cross-tenant probe. The route and production build remain
review-only: no promotion, QR printing, persistence activation, or student
use is enabled by this decision.
