# DR-962: Evidence Bundle Returned Manifest Binding

## Decision

The prototype evidence alignment bundle must include and validate the returned
package manifest that produced the evidence.

## Required Invariants

- The returned manifest is part of every alignment bundle.
- Its tenant and request ID match the return review and downstream evidence.
- Manifest validation runs before an alignment bundle can pass.
- Duplicate returned manifest IDs are rejected across a bundle collection.
- Alignment remains evidence-only and cannot authorize import, routes,
  promotion, assignment, or live AI dispatch.

## Evidence

- ADR 0890
- `packages/content-model/src/aiPrototypeEvidenceAlignment.ts`
- `scripts/verify-runtime-behavior.mjs`
