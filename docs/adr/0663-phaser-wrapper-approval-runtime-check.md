# ADR 0663: Phaser Wrapper Approval Runtime Check

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The runtime behavior harness must execute the Phaser candidate review
validator. It accepts a representative blocked review packet and rejects a
packet that changes the approval status to `approved-for-wrapper` while
blockers or missing evidence remain.

## Rationale

The wrapper approval state controls whether a future platform-owned adapter
may even be reviewed. A text-only or UI-only check could drift from the shared
validator and create a false sense of readiness. Executable coverage keeps
the blocked-by-default rule enforceable during foundation changes.

## Consequences

- Candidate approval remains review-only and does not enable source promotion.
- Future changes to the validator must preserve an executable blocked and
  unresolved-approval regression case.
- The runtime harness now covers both canonical event replay and external
  candidate wrapper gating.
