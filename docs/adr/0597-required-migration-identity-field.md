# ADR-0597: Required Migration Identity Field

Status: Accepted

## Decision

Every vendor-neutral migration specification must mark its declared primary key
field as required.

The backend contract alignment validator checks this before a migration is
treated as coherent.

## Why

An identity field that is present in the record shape but optional still allows
records that cannot be addressed, joined, exported, or safely rolled back.
Hosted and closed/local implementations need the same non-optional identity
boundary.

## Guardrails

- This is a contract check only; it does not select a database vendor or enable
  live persistence.
- Upload, approval, promotion, download, and student-facing use remain
  independently gated.

## Consequences

Migration authors receive an immediate failure when a primary key is optional.
The implementation contract remains explicit without requiring full
schema-to-migration field parity for every intentionally narrow pilot spec.
