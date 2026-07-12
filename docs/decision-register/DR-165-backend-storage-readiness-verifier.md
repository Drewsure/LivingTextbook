# DR-165: Backend Storage Readiness Verifier

## Decision

Add a focused backend-storage readiness verifier and include it in the foundation command.

## Rationale

Choosing a backend too early could lock the product into the wrong cost, privacy, reporting, or local-deployment assumptions. A verifier keeps the vendor-neutral storage contract intact while the build continues.

## Accepted Direction

- Add `scripts/verify-backend-storage-readiness.mjs`.
- Add `npm run verify:backend-storage`.
- Include the command in `npm run verify:foundation`.
- Expose the command on `/teacher/intake` through the foundation verification gate.

## Follow-Up

Expand this verifier when the first real backend adapter or migration files are introduced.
