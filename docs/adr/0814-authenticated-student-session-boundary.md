# ADR 0814: Authenticated student session boundary

## Status

Accepted for the first closed/local durable progression pilot.

## Decision

Use a server-validated coded front door to establish a short-lived signed
student session. The session binds tenant, package, launch, and coded learner
slot identity. The browser receives only an HttpOnly, SameSite cookie; it never
receives the persistence API token or database credentials.

The durable progression route accepts a browser write only when the signed
session identity matches all expected identity fields in the validated request.
Teacher/server read probes continue to use a separate server-only bearer token.
When SQLite or its explicit durable gates are disabled, the front door remains
rehearsal-only and is labeled as such.

## Consequences

- The first durable write path is usable from a real coded browser launch.
- Entry and user codes are checked twice: client-side for immediate guidance
  and server-side for authority.
- Sample registry validation is intentionally isolated to this closed pilot;
  a tenant-backed launch registry must replace it before general sale.
- Production cloud use still requires real teacher/student authentication,
  roster lifecycle, key rotation, backups, encryption, retention/deletion,
  monitoring, and multi-instance evidence.

## Verification

- `docs/verification/AUTHENTICATED_STUDENT_SESSION_CHECKS.md`
- `npm run verify:durable-persistence`
- web typecheck and production build
- temporary SQLite smoke test: authenticate, write, read, restart, isolate
