# ADR 1120: Release-Readiness Observation Bridge

## Decision

Add a client-side, read-only observation bridge to the white-label release-
readiness surface. It reads only the exact browser-local scope for the reviewed
partner package and derives the existing adult evidence-review handoff.

## Boundaries

Missing evidence remains missing and links back to the teacher observation
surface. Present evidence never changes readiness status and cannot export,
write hosted persistence, promote a release, mutate QR routes, assign work, or
launch students.

## Verification

- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:routes`
- Full foundation verification before publication.
