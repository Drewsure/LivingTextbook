# ADR-0548: Progress Event Stream Context

Status: Accepted  
Date: 2026-09-11

## Decision

Progress-event streams must remain within one unit, launch, and student-session identity whenever those fields are present.

## Context

The validator now checks individual event type, mode, unit, timestamp, and policy identity. A stream could still combine individually valid events from different content units or sessions and make a future report or persistence batch misleading.

## Consequences

- Multiple curated modes remain valid within one unit stream.
- Mixed unit, launch, or student-session contexts become review blockers.
- The guard applies before hosted, local, or hybrid report/persistence integration.
- This remains a verification guard and does not enable gameplay, scoring, persistence, or provider writes.

## Verification

- Runtime behavior rejects a stream with mixed unit, launch, and student-session values.
- Content-model and web typechecks pass.
- Foundation verification must pass before release.
