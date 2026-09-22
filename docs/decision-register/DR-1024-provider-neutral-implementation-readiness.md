# DR-1024: Provider-Neutral Implementation Readiness

Decision: use one tenant/package-bound handoff before selecting or implementing
a hosted or closed-local persistence provider.

The foundation sample reconciles snapshot, adapter, retention, audit, and
school-policy evidence while keeping provider selection and all side effects
blocked.

Evidence: `docs/adr/0952-provider-neutral-implementation-readiness.md`,
`packages/content-model/src/pilotReviewDecisionImplementationReadiness.ts`,
and `scripts/verify-pilot-review-decision-implementation-readiness.mjs`.
