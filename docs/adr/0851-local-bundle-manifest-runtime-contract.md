# ADR 0851: Local Bundle Manifest Runtime Contract

## Status

Accepted.

## Decision

Define and execute a shared local bundle manifest validator before any local
bundle writer, service-worker cache, or offline student-data store is enabled.
The validator accepts planning manifests with warnings and only accepts an
offline-ready claim when paths, identifiers, checksums, and rights evidence meet
the contract.

## Rationale

Local textbook companions need dependable year-on-year media updates and stable
QR routes. Treating a JSON planning shape as a trusted bundle would allow path
traversal, ambiguous asset identity, or a false offline-ready claim to cross the
deployment boundary.

## Guardrails

- Validation is pure and tenant-scoped by manifest identity.
- File copying, checksum generation, service-worker registration, and offline
  learner-data storage remain disabled.
- Placeholder checksums remain visible warnings for planning samples and are
  errors for offline-ready manifests.
- The validator does not decide media rights; it requires rights evidence to be
  present before offline-ready status can be structurally valid.

See `docs/verification/LOCAL_BUNDLE_MANIFEST_RUNTIME_CHECKS.md` and
`docs/decision-register/DR-923-local-bundle-manifest-runtime-contract.md`.
