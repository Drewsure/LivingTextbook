# ADR 0577: Evidence Alignment Panel Visibility

Status: Accepted

## Decision

Use the shared collection-level evidence-alignment validator in every teacher
prototype review panel, and explicitly show that duplicate packet identities
are blocked.

## Context

The collection validator protected readiness summaries, but the review panel
was still validating packets individually. That could leave a teacher or
reviewer looking at a green per-packet message while the collection itself had
an identity conflict.

## Consequences

- Reviewers see the same collection-level result used by readiness summaries.
- Packet count, per-packet alignment, and collection identity remain visible
  in one review-only surface.
- No upload, import, route replacement, scoring mutation, or assignment is
  enabled.

## Verification

Prototype-review verification and web typecheck must pass, followed by the
full foundation suite and active route checks.
