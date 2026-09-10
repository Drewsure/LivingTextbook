# ADR-0538: Game Catalog Learner-Facing Metadata

Status: Accepted

## Decision

Validate each game catalog item for learner role, skill focus, non-empty summary, and explicit background-media capability in the existing game-mode verifier.

## Context

The catalog feeds teacher review and student pathway surfaces as well as route selection. A mode can have valid routing metadata while still lacking the explanation and classification needed for a safe, understandable experience.

## Guardrails

- Roles are limited to `entry-practice`, `reinforcement`, `assessment`, and `review`.
- Skill focus is limited to the shared vocabulary, syntax, listening, speaking, review, and mixed values.
- Summaries must be non-empty.
- Background-media capability must be explicitly true or false.
- This slice is verification-only; it does not enable gameplay, storage, release, assignment, or student progression.

## Consequence

Catalog omissions fail early with deterministic feedback, keeping teacher-facing pathway decisions understandable before deeper game integration work begins.
