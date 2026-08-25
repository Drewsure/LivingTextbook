# ADR 0441: Teacher Review Verifier Result Dependency

Status: Accepted

## Context

The generator route now defines verifier result evidence as an offline review preview. The teacher review packet still needs to depend on that result evidence rather than treating verifier submission packet visibility as enough.

## Decision

Update AI generated package teacher review packets so verifier result evidence is a required record, missing evidence item, and blocked approval dependency.

## Consequences

- Teacher approval prep now follows verifier result evidence.
- Verifier submission packet visibility alone cannot imply approval readiness.
- Route, playlist, assignment, package, and student-ready actions remain blocked.
- MiniStar support-language boundaries remain preserved.

## Non-Goals

This does not implement teacher approval capture, live verifier results, package approval, route writes, playlist writes, assignments, or student-ready state.
