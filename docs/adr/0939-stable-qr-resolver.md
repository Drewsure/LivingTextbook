# ADR-0939: Stable QR Resolver Boundary

Status: Accepted

## Decision

Extract edition QR parsing and alias lookup into a reusable, tenant-scoped
resolver. The current route remains a preview and cannot mutate production
redirects, but future hosted and local deployments can share the same parsing
and matching behavior.

## Safety rules

- Required identity segments must be present.
- Duplicate identity keys and malformed encoded values fail closed.
- Alias matching includes tenant, series, book, unit, activity, language,
  edition, and version when supplied.
- Direct file, localhost, and development targets remain blocked by the route.

Evidence: `apps/web/src/data/editionQrAliasResolver.ts`,
`apps/web/src/app/q/[...segments]/page.tsx`, and
`scripts/verify-edition-qr-alias-resolver.mjs`.
