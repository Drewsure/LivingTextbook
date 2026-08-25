# ADR 0442: Promotion Checklist Verifier Result Dependency

Status: Accepted

## Context

The generator route now defines verifier result evidence and teacher review depends on it. The generated package promotion checklist also needs that same dependency so promotion cannot proceed from verifier submission visibility alone.

## Decision

Update AI generated package promotion checklists so verifier result evidence is a required promotion step, next required record, and blocked promotion dependency.

## Consequences

- Promotion review now follows verifier result evidence.
- Verifier submission packet visibility alone cannot imply promotion readiness.
- Route, playlist, assignment, package, local bundle, and student-ready actions remain blocked.
- MiniStar support-language boundaries remain preserved.

## Non-Goals

This does not implement live verifier results, package promotion, route writes, playlist writes, assignments, local bundle writes, or student-ready state.
