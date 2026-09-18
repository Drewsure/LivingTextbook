# DR-924: Read-Only Local Bundle Resolver

## Decision

Use a validated, tenant-scoped, read-only resolver to rehearse local QR and
media fallback behavior before implementing local bundle loading or activation.

## Included

- Manifest-declared QR fallback resolution.
- Manifest-declared local asset resolution.
- Expected-tenant matching.
- Unknown identifier rejection.
- Invalid-manifest rejection.

## Excluded

Directory reads, file reads, file writes, uploads, bundle creation, service
workers, media caching, offline learner-data storage, and local handoff.

See ADR 0852 and
`docs/verification/LOCAL_BUNDLE_MANIFEST_RUNTIME_CHECKS.md`.
