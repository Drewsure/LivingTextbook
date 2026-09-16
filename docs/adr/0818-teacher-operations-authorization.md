# ADR 0818: Tenant-Scoped Teacher Operations Authorization

## Decision

Protect persistence operation history with a teacher-only, expiring session
that is separate from the student session. The session carries a tenant ID,
teacher role, and `persistence:read` scope. The history route requires that
session or the existing server-only persistence token, and requires a tenant
query parameter for every request.

Receipt history is filtered by a one-way tenant scope digest. Backup and
restore receipts are platform-wide operational evidence and therefore remain
hidden from tenant teachers; identity-scoped retention receipts may be shown
only to the matching tenant.

## Rationale

The earlier read-only history surface protected sensitive fields but did not
protect access to the endpoint itself. A separate teacher boundary closes that
gap without reusing learner credentials or pretending that a review screen is
a full production identity provider.

## Guardrails

- Review-code session issuance is an explicitly bounded closed-pilot bridge.
- A required tenant allowlist prevents a valid code from being used for an
  unregistered tenant.
- Signing secrets, review codes, persistence tokens, and learner data remain
  server-only.
- The browser cannot mutate, export, repair, or launch from this surface.
- A teacher page refresh may discover the current signed session through a
  read-only session-status request; it cannot create or broaden access.
- Unscoped legacy receipts remain hidden from tenant history until they can be
  safely attributed.

## Verification

Run `npm run verify:teacher-operations-auth`,
`npm run verify:durable-operations`, web typecheck, production build, and
active-route verification. See
`docs/verification/TEACHER_OPERATIONS_AUTHORIZATION_CHECKS.md`.
