# Persistence Server Policy Boundary Checks

## Purpose

Protect the separation between browser persistence intent and server-owned
institutional authorization.

## Required invariants

- Browser writes contain identity, envelope, and `requestedMode` only.
- Client-supplied policy objects are rejected.
- The server derives school-policy, retention, release, and write flags from
  deployment configuration.
- Durable writes remain gated by provider, deployment flags, and signed-session
  or server-token authorization.
- Review, rehearsal, invalid, unauthorized, and unavailable paths are
  side-effect free.

## Verification commands

```text
npm run verify:runtime-behavior
npm run verify:backend-storage
```

The focused checks must pass with web typecheck, production build, and active
route verification before persistence is considered pilot-ready.
