# ADR-0599: Migration Policy Status Alignment

Status: Accepted

## Decision

When a migration candidate is marked `needs-policy`, every corresponding
migration specification must be marked `blocked-by-policy`. A policy-blocked
candidate must not present a ready-for-review storage contract.

The backend contract alignment validator checks this relationship before a
migration is treated as coherent.

## Why

Candidate status communicates sequencing and policy readiness, while spec
status communicates the state of the record contract. If those states disagree,
the teacher/publisher review surface can imply that backend work is ready when
the product policy that governs it is not.

## Guardrails

- This is a readiness check only; it does not select a database vendor or
  enable live persistence.
- The release-candidate sample remains reviewable but blocked by policy.
- Upload, approval, promotion, download, and student-facing use remain
  independently gated.

## Consequences

Policy-blocked backend work is represented consistently across sequencing and
storage layers. A policy decision must be recorded before a spec can move to
ready-for-review.
