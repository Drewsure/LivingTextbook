# ADR 1237: Controlled Pilot Delivery Writer

## Decision

Add an explicitly gated, authenticated writer for the first operational pilot
handoff. The initial writer materializes only the approved delivery manifest,
manual release receipt, and immutable handoff metadata inside a configured
custody root.

## Safety boundary

The writer requires a dedicated operator token and
`LIVING_TEXTBOBOOK_PILOT_DELIVERY_WRITES_ENABLED=true`. It validates the
manifest, receipt, source checksum, tenant/package/version identity, operator
identity, and custody-root filesystem boundary before writing. It is
idempotent for the same record and conflicts on a different record; it never
overwrites an existing release.

## Deferred operations

Raw media copying, local bundle activation, hosted persistence activation, QR
alias mutation, student-facing activation, and learner data remain separate
operations with their own evidence and rollback requirements.

## Verification

Run `node scripts/verify-pilot-delivery-writer.mjs`, web typecheck,
production build, active route verification, and the full foundation
composition suite.
