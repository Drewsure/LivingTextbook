# ADR-0598: Migration Candidate Spec Coverage

Status: Accepted

## Decision

Every migration candidate that is not explicitly deferred must have at least
one corresponding migration specification. A deferred candidate must not have
implementation specs until its policy or sequencing blocker is cleared.

The backend contract alignment validator checks this relationship before a
migration is treated as actionable.

## Why

Candidate lists and migration specs serve different purposes: the former
describes sequencing and risk, while the latter describes a record contract.
Allowing an actionable candidate without a spec creates an undocumented gap;
allowing a deferred candidate to carry implementation specs creates a false
signal that it is ready.

## Guardrails

- This is a readiness check only; it does not select a database vendor or
  enable live persistence.
- Deferred local export/restore work remains visible without being presented as
  implementation-ready.
- Upload, approval, promotion, download, and student-facing use remain
  independently gated.

## Consequences

New backend work must move through both a sequenced candidate and an explicit
record specification. Intentional deferrals remain expressible without
creating partial storage contracts.
