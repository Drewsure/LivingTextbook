# ADR 0090: Training Focus Route Query

## Status

Accepted

## Context

Training Academy supports multiple recovery focus configs, but the route always opened on vocabulary review. Triggered recovery should be able to point students to the most relevant lane while preserving one reusable route.

## Decision

Allow `/training/[code]` to read an optional `focus` query parameter and use it as the initial focus when it matches a reviewed `TrainingFocusType`.

## Consequences

Recovery remains config-driven and route-light. Invalid query values fall back safely. Future persistence can store selected focus without changing the route pattern.

