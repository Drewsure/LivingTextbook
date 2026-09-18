# DR-923: Local Bundle Manifest Runtime Contract

## Decision

Use a shared runtime validator for local/offline bundle manifests before any
bundle writer or offline activation path is considered.

## Included

- Safe relative asset and content paths.
- Application-relative QR fallback paths.
- Unique asset identifiers and local paths.
- Final checksum and rights evidence requirements for offline-ready claims.
- Planning-mode warnings without student-facing activation.

## Excluded

File uploads, checksum generation, bundle writes, service-worker registration,
offline learner-data storage, rights approval, and local product handoff.

See ADR 0851 and
`docs/verification/LOCAL_BUNDLE_MANIFEST_RUNTIME_CHECKS.md`.
