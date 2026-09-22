# DR-1019: Pilot Review Decision Persistence Boundary

Decision: retain the canonical teacher review decision through a provider-
neutral, tenant-bound metadata record with equivalent hosted and local adapter
intents.

The record keeps status, blockers, next steps, and evidence bindings. It does
not store raw learner audio or transcripts in the core tier, and it cannot
authorize activation, student launch, report export, approval capture, or
package promotion.

The demo remains static and review-only. A future production write requires a
provider, retention, school-policy, and audit decision.

Evidence: `docs/adr/0947-pilot-review-decision-persistence-boundary.md`,
`apps/web/src/data/samplePilotReviewDecisionPersistence.ts`, and
`scripts/verify-pilot-review-decision-persistence.mjs`.
