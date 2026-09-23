# ADR 1118: Teacher Observation Capture

## Decision

Add an explicit teacher-triggered, browser-local capture action to the bound
session evidence panel. The action creates a human-observed observation receipt
using the shared tenant/package/session contract.

## Boundaries

The receipt is review-only. It cannot write hosted persistence, export learner
data, assign work, mutate QR routes, promote a release, or launch students.
Malformed records and cross-tenant lookups are hidden on read.

## Verification

- `npm run verify:browser-rehearsal-observation`
- `npm run verify:browser-rehearsal-observation-runtime`
- `npm run typecheck --workspace @living-textbook/web`
- Full foundation verification before publication.
