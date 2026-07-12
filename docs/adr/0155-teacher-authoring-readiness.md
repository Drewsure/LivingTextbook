# ADR 0155: Teacher Authoring Readiness

## Status

Accepted

## Context

Competitor products emphasize fast teacher activity creation and editing. Living Textbook should support that, but must preserve reviewed package data, learner audio, target-language progression, source lineage, and tenant governance.

## Decision

Add a teacher authoring readiness plan, teacher/admin panel, and verifier.

## Consequences

- `/teacher/intake` shows teacher authoring lanes and student-assignment blockers.
- Quick draft, copy/edit, activity pathway edit, and printable authoring are planned.
- Direct AI publish is blocked.
- `npm run verify:teacher-authoring` is included in `npm run verify:foundation`.
- Fast authoring becomes a draft workflow, not a shortcut around review.
