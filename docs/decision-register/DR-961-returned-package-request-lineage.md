# DR-961: Returned Package Request Lineage

## Decision

Returned prototype evidence must remain bound to one generation request from
intake queue through return checklist, returned manifest, and downstream
evidence alignment.

## Required Invariants

- Intake queue items carry a non-empty generation `requestId`.
- Return checklists carry the same generation `requestId` as their queue item.
- Returned manifests must match the checklist and intake request IDs.
- Tenant, queue item, repository, mode, parent engine, and target surface must
  continue to match as well.
- A lineage mismatch blocks review alignment and never authorizes import,
  promotion, launch, assignment, or live AI dispatch.

## Evidence

- ADR 0889
- `packages/content-model/src/aiPrototypeReturnedPackageAlignment.ts`
- `scripts/verify-runtime-behavior.mjs`
