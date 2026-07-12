# DR-155: Teacher Authoring Readiness

## Decision

Treat teacher authoring as a draft-first workflow with explicit student-assignment gates.

## Rationale

Teachers need fast creation and editing, but the platform cannot let speed bypass review, audio, rights, route, package versioning, or target-language progression. This is especially important for young learners and white-label tenants.

## Accepted Direction

- Add teacher authoring readiness planning data.
- Show authoring lanes on `/teacher/intake`.
- Add `npm run verify:teacher-authoring`.
- Include teacher authoring verification in `npm run verify:foundation`.
- Block direct AI publish and direct draft assignment.

## Follow-Up

After auth and persistence are selected, define durable draft ownership, copy/edit lineage, approval, and package version records.
