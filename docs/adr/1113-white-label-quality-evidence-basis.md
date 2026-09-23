# ADR 1113: White-Label Quality Evidence Basis

## Decision

Require each white-label release quality record to declare a check-specific
evidence kind and a non-empty, unique scope.

## Rationale

Release readiness covers different kinds of proof. A route sweep is not a
browser rehearsal, and a generic runtime check is not a tenant-isolation
negative test. Explicit evidence basis prevents a green record from hiding a
missing required verification lane.

## Consequences

- Quality evidence becomes auditable by kind and scope.
- Tenant and privacy checks remain separately visible.
- All release and student-facing side effects remain disabled.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `npm run verify:runtime-behavior`
- Full foundation verification before publication.
