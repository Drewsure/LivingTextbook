# ADR 1218: Durable Secret-Rotation Policy Gate

**Status:** Accepted  
**Date:** 2026-09-25

## Context

Student and teacher session cookies already support a current secret plus a
bounded previous secret during deliberate rotation. Durable persistence also
depends on server-only bearer and review credentials. A production deployment
must have a documented rotation and revocation procedure before learner data
is enabled, but the current scaffold must not invent or rotate secrets.

## Decision

Durable operations and deployment readiness require
`LIVING_TEXTBOOK_PERSISTENCE_SECRET_ROTATION_POLICY_ACCEPTED=true`. The flag is
false by default and represents a human deployment-policy acknowledgement only.
It may be enabled after current/previous-secret overlap, revocation, expiry,
incident response, and tenant ownership are documented.

The existing bounded current/previous secret readers remain the only runtime
behavior in this slice. Process-memory rehearsal is unchanged.

## Consequences

- A durable deployment cannot appear ready without an explicit credential
  rotation plan.
- No secret is generated, persisted, exposed, or rotated by this gate.
- Production approval still requires executable rotation evidence and a human
  owner for the selected deployment profile.

## Verification

`npm run verify:durable-persistence` and
`npm run verify:durable-operations` require the policy field and its default
false environment contract.
