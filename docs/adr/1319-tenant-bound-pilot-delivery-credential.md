# ADR 1319: Bind Pilot Delivery Credentials to Explicit Tenants

## Status

Accepted and implemented on 2026-09-30.

## Context

The final pilot delivery lane can write bounded delivery metadata, approved QR
alias records, release receipts, and closed-local package artifacts. Those
operations are intentionally gated, but a deployment-wide delivery bearer
token would still be unsafe if it could act for any caller-supplied publisher
tenant.

## Decision

Require `LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS` as a comma-separated
exact tenant allowlist whenever the controlled delivery credential is used.
The shared delivery authorization helper is used by metadata reads/writes, QR
registry writes, release receipt capture, and local package assembly.

The credential-only helper may bypass browser-origin checks for an operator or
machine call, but it is not tenant authorization. Each operation must perform
the tenant-bound check after reading the request's manifest or bounded tenant
identity.

## Consequences

- One publisher's delivery token cannot assemble or inspect another tenant's
  package.
- Local package assembly and QR generation remain possible for an explicitly
  allowed tenant after all independent review and release gates pass.
- Deployment handoff must record the exact tenant allowlist, without exposing
  the bearer token to the browser or evidence packet.
- Existing review-only and student-activation blockers remain unchanged.

## Verification

`node scripts/verify-pilot-delivery-writer.mjs`,
`node scripts/verify-local-pilot-package-assembler.mjs`, and
`npm run verify:publisher-intake-rehearsal` cover the helper usage, allowed
tenant path, rejected cross-tenant metadata read, and unchanged package-writer
blockers.
