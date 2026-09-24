# DR-1162: Deployment Continuity Scope

Decision: Require deployment continuity recovery evidence to match the pilot
deployment tenant and package.

- Reject tenant drift and package drift as hard blockers.
- Keep all continuity paths review-only and non-activating.

References: ADR 1162, Build session 1076, and
`scripts/verify-deployment-continuity-scope.mjs`.
