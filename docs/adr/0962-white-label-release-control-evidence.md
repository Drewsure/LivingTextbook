# ADR 0962: White-Label Release-Control Evidence Binding

Status: Accepted

## Context

The white-label readiness dashboard already carried package-lane evidence,
pilot evidence, and quality evidence. It did not yet bind the package publish
gate and approval ledger as one typed release-control record. That left open
gate and approval counts vulnerable to becoming a duplicated summary.

## Decision

Add release-control evidence to the readiness contract. The sample record
derives blocking gate and open approval counts from the authoritative publish
gate and approval ledger, records their source identifiers, and remains
review-only.

## Consequences

- Release readiness now has a traceable package-to-approval control join.
- False-ready control records are rejected at the shared model boundary.
- Promotion and student-facing activation remain unavailable until later
  governed production work closes the controls.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
