# ADR 1128: Composite Evidence Release Binding

## Decision

Carry the composite evidence-to-pilot binding into the white-label release
readiness route as a derived, exact-scope release binding. Its states are
awaiting composite evidence, blocked by composite evidence, and accepted for
release review.

## Boundaries

Accepted-for-release-review is not production approval. The binding remains
review-only and provider-neutral; production approval, student launch, package
promotion, hosted persistence, and QR mutation remain false.

## Verification

- `npm run verify-browser-privacy-tenant-evidence-release-binding`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`

