# DR-444: AI Generated Publish Readiness Gate Validator

## Status

Accepted.

## Context

Generated publish readiness gates are the last-mile review boundary before student-facing routes, playlists, assignments, local bundles, and student-ready markers. They need a shared guard so readiness cannot be inferred from UI text or sample data alone.

## Decision

Add a shared `validateAiGeneratedPublishReadinessGate` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires correction queue, verifier, manifest, reward, release-control, teacher approval, allowed review-only actions, blocked publish actions, next records, and blocked future route evidence.

## Consequences

- Publish readiness gates stay review-only until future release-control and package-writer gates exist.
- No route creation, route registry write, media playlist write, assignment creation, local bundle write, or student-ready marker is enabled.
- Support-language-only generated package publishing remains blocked for every white-label tenant.
