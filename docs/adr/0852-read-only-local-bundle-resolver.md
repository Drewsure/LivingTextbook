# ADR 0852: Read-Only Local Bundle Resolver

## Status

Accepted.

## Decision

Add a shared read-only resolver that can rehearse local QR and asset resolution
from a validated manifest. The resolver must use only manifest-declared values,
require the expected tenant identity, and return no result for unknown or
cross-tenant identifiers.

## Rationale

The platform needs to rehearse permanent QR and local media fallback behavior
before it can safely implement a local bundle loader. A resolver that guesses
paths or ignores tenant scope would make the local companion boundary unsafe.

## Guardrails

- The resolver accepts a validated manifest only.
- It does not inspect directories, read files, copy assets, write bundles,
  register service workers, or store learner data.
- It returns manifest-declared application fallback paths and local asset paths
  only after a matching tenant identity is supplied.
- It remains `read-only-rehearsal` even when a manifest contains final checksum
  and rights evidence.

See `docs/verification/LOCAL_BUNDLE_MANIFEST_RUNTIME_CHECKS.md` and
`docs/decision-register/DR-924-read-only-local-bundle-resolver.md`.
