# ADR-0548: Progress Event Stream Context

Status: Accepted  
Date: 2026-09-11

## Decision

Progress-event streams must remain within one unit and launch identity whenever those fields are present. Multiple learner sessions are valid inside a class-scoped launch report.

## Context

The validator now checks individual event type, mode, unit, timestamp, and policy identity. A stream could still combine individually valid events from different content units or launches and make a future report or persistence batch misleading. Teacher reports may legitimately aggregate multiple learner sessions under one classroom launch.

## Consequences

- Multiple curated modes remain valid within one unit stream.
- Mixed unit or launch contexts become review blockers.
- Multiple student sessions remain allowed within one launch-scoped teacher report.
- The guard applies before hosted, local, or hybrid report/persistence integration.
- This remains a verification guard and does not enable gameplay, scoring, persistence, or provider writes.

## Verification

- Runtime behavior rejects a stream with mixed unit and launch values while permitting mixed student sessions.
- Content-model and web typechecks pass.
- Foundation verification must pass before release.
