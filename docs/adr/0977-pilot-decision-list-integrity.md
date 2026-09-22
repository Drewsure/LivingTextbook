# ADR 0977: Pilot Decision List Integrity

Status: Accepted

## Context

Pilot blockers and required next steps are shown to teachers and publisher
reviewers and influence readiness status. Blank or repeated entries can distort
counts and hide that the evidence packet is incomplete.

## Decision

Canonical pilot decisions require blocker and required-next-step lists to use
non-empty unique strings. The white-label readiness wrapper applies the same
strictness to its blocker list.

## Consequences

- Readiness counts reflect distinct actionable evidence.
- Malformed source decisions fail before snapshot rehearsal.
- No persistence, reporting, promotion, or student access is enabled.

## Verification

Snapshot-runtime and release-readiness behavior tests cover blank and duplicate
list entries.
