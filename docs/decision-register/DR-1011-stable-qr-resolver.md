# DR-1011: Stable QR Resolver Boundary

Decision: use one reusable, tenant-scoped alias resolver for printed QR
identities across hosted and local deployment paths.

Required invariants:

- Missing, duplicate, and malformed QR segments fail closed.
- Alias matching preserves tenant and edition identity.
- Preview resolution cannot mutate redirects, packages, or release state.
- Direct file and development-host targets remain prohibited.

Evidence: `docs/adr/0939-stable-qr-resolver.md`,
`apps/web/src/data/editionQrAliasResolver.ts`, and
`scripts/verify-edition-qr-alias-resolver.mjs`.
