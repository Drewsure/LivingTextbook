# ADR 0827: Pilot Preflight Behavior Gate

## Status

Accepted for foundation hardening.

## Context

Static source checks prove that the preflight boundary is represented, but
they do not prove its state transitions. The review-only pilot boundary needs
behavior coverage before more release or persistence work is layered on top.

## Decision

Compile the preflight and evidence-envelope modules in a temporary verification
workspace and assert three deterministic cases: a complete envelope is
`ready-for-review`, an unfinished workflow is `incomplete`, and a prohibited
privacy flag is `invalid`. Every case must remain launch-blocked and
durable-write-blocked.

## Consequences

- Changes to the preflight logic must preserve its state semantics.
- The test does not require a browser, database, or live learner data.
- Production authorization remains a separate future release decision.
