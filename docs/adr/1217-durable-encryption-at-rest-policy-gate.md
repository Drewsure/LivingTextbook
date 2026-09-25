# ADR 1217: Durable Encryption-at-Rest Policy Gate

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The first durable provider stores learner progression in SQLite and creates
backup artifacts. SQLite and its filesystem backups do not provide encryption
at rest by themselves. Reporting durable readiness without a deployment-owned
encryption and key-management decision would be unsafe for a saleable
white-label product.

## Decision

Durable operations and the durable deployment gate require
`LIVING_TEXTBOOK_PERSISTENCE_ENCRYPTION_AT_REST_ACCEPTED=true`. That value is a
deployment policy acknowledgement, not an implementation switch. It may be
enabled only after the school or publisher documents approved encryption at
rest, key ownership, rotation, access controls, and backup protection.

The default remains false. Process-memory rehearsal is unchanged, and no
encryption provider, key, learner record, or secret is created by this gate.

## Consequences

- A durable deployment cannot appear ready while its data-protection decision
  is missing.
- Primary SQLite data and backup artifacts share the same explicit protection
  review requirement.
- A later provider implementation must replace the acknowledgement with
  executable encryption and key-rotation evidence before production approval.

## Verification

`npm run verify:durable-operations` and
`npm run verify:durable-persistence` require the policy field and its fail-closed
error contract.
