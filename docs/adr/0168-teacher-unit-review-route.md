# ADR 0168: Teacher Unit Review Route

Date: 2026-07-12

## Status

Accepted

## Context

The teacher/admin intake page is useful for platform planning, but it is too broad for a teacher or partner who needs to review one unit before classroom launch. The route contract already reserved `/teacher/units/[unitKey]`.

## Decision

Promote `/teacher/units/[unitKey]` to an active scaffold for reviewed unit packages.

The route shows package evidence, audio/media coverage, curated activity paths, teacher/student route readiness, assignment controls, and pilot blockers for both MiniStar and the sample publisher.

## Consequences

Teachers and partners now have a focused unit-review surface before assignment. This remains a review scaffold only: no live editor, production publish button, or persisted assignment settings are introduced in this slice.
