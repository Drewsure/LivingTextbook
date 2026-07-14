# ADR 0221: Student Launch Context Boundary

Date: 2026-07-15

## Status

Accepted

## Context

The admin side now has a classroom launch gate route. The student-facing demo routes also need a small visible boundary so controlled practice is not mistaken for a live classroom launch or production student account flow.

## Decision

Add a reusable `LaunchContextSafetyCard` to direct launch and front-door routes.

The card states that the route is controlled practice, that target language unlocks progress, that support language and media do not replace English activity completion, and that no production student accounts are being used.

## Consequences

- Student-facing demo routes align with the admin launch gate boundary.
- Teachers can test with confidence that visible route language does not imply a live pilot.
- The card does not enable live classroom launch, report export, production student accounts, or real learner data collection.
