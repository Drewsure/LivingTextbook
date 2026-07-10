# ADR 0118: Pilot Release Candidate Summary

## Status

Accepted

## Context

The teacher intake route contains a publish gate and approval ledger, but first-pilot planning needs a single release-candidate view that combines those signals.

## Decision

Add a `PilotReleaseCandidatePanel` to `/teacher/intake` that summarizes tenant, package, open release-blocking gates, and open required approvals.

## Consequences

- Demo readiness and pilot readiness remain visibly separate.
- Release-control logic becomes easier to review before backend selection.
- Future persistence can store this status without changing the teacher/admin concept.

