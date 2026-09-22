# DR-1018: Canonical Teacher Review Decision

The pilot command view now exposes one review-only decision that binds the
canonical pilot and evidence handoffs. It derives release blockers, approval
state, persistence and activation blockers, and required next steps while
keeping live launch, real learner data, export, signing, and promotion blocked.

Evidence:

- `packages/content-model/src/pilotReviewDecision.ts`
- `apps/web/src/data/samplePilotReviewDecision.ts`
- `apps/web/src/features/pilot/PilotReviewDecisionPanel.tsx`
- `scripts/verify-pilot-readiness-dashboard.mjs`
