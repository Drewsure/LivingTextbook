# ADR-0549: Progress Event Acceptance Gate Consistency

Status: Accepted  
Date: 2026-09-11

## Decision

Progress-event streams must use one `event_acceptance_gate_id` value.

## Context

The stream validator already prevents mixed units and launches while allowing classroom reports to aggregate learner sessions. A stream could still combine evidence from different reviewed acceptance gates and appear to be one coherent report or persistence batch.

## Consequences

- Mixed acceptance-gate IDs become review blockers.
- Multiple modes and learner sessions remain valid inside one unit, launch, and gate.
- This remains a verification guard before hosted, local, or hybrid adapters.

## Verification

- Runtime behavior rejects a stream with `gate-1` and `gate-2`.
- Content-model and web typechecks pass.
- Foundation verification must pass before release.
