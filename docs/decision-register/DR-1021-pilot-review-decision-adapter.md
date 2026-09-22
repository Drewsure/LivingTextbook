# DR-1021: Pilot Review Decision Adapter

Decision: use one review-only adapter for all pilot review decision snapshot
operations before provider activation.

Validate, write, restore, and export remain explicitly blocked. Results prove
no side effect and preserve tenant/package/mode identity.

Evidence: `docs/adr/0949-pilot-review-decision-adapter.md`,
`packages/content-model/src/pilotReviewDecisionPersistence.ts`, and
`scripts/verify-pilot-review-decision-snapshot.mjs`.
