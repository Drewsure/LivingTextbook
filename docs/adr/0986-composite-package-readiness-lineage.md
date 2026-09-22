# ADR 0986: Composite Package-Readiness Lineage

## Decision

Validate package readiness, its source assembly, and its structured extraction
preview as one tenant- and package-scoped review-only evidence chain.

## Boundaries

- The composite check is evidence reconciliation, not extraction acceptance.
- Candidate-unit scope drift fails closed even when each individual record is
  valid in isolation.
- No draft, storage write, promotion, route, assignment, or student access is
  authorized by this check.

## Rationale

Separate validators can prove local record shape without proving that the
three records describe the same source scope. One composite boundary makes
that relationship explicit and reusable for future hosted and local adapters.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`apps/web/src/data/samplePackageReadinessReconciliation.ts`, and
`scripts/verify-runtime-behavior.mjs`.
