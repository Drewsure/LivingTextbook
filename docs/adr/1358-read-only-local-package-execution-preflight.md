# ADR 1358: Read-Only Local Package Execution Preflight

## Status

Accepted

## Context

The local package writer already validated delivery lineage, the durable review
packet, approved QR custody, bundle content, approved asset custody, source
files, print configuration, and the explicit local-package write gate. Those
checks were embedded in the mutation route, so an operator could not obtain a
single bounded answer to the question: “Would the package writer be allowed to
run now?”

## Decision

Add a read-only execution preflight using the same custody and writer checks.
The preflight accepts the writer's bounded request shape, reconciles the
durable lineage and metadata records, validates the approved source file plan,
and reports `ready-for-assembly` or `blocked` without creating directories,
copying files, generating QR output, renaming a staging directory, or writing
metadata.

Expose it through:

- `POST /api/teacher/delivery/local-package/preflight`

The actual local package writer calls the same assembly preflight immediately
before it can write. This keeps the operator result and mutation gate aligned.

## Consequences

- A publisher handoff can show a concrete execution readiness result before a
  local package write is attempted.
- Missing review lineage, custody metadata, approved assets, source files,
  roots, print configuration, or the explicit write gate remain visible as
  blockers.
- The preflight is safe to poll or display in a teacher/operator workspace.
- The preflight does not replace human release authorization and does not
  activate students, mutate QR aliases, enable hosted persistence, or store
  learner records.

## Protected boundaries

The preflight response exposes only bounded identities, counts, status, and
errors. It does not expose secrets, filesystem paths, raw publisher payloads,
learner records, or asset bytes. `sideEffect` is always `none` and
`performedWrite` is always `false` on the preflight route.

## Verification

- `npm run verify:local-pilot-package-assembler-behavior`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:foundation-composition`
