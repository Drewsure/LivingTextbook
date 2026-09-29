# ADR 1243: Local Package Runtime Navigation

## Status

Accepted for the first white-label pilot foundation.

## Context

The local package runtime reader can validate a package through an API, but a
publisher handoff also needs a usable tenant-branded entry point. Without a
route, the package is technically inspectable but not practically testable by
the teacher or student who receives it.

## Decision

Add a parameterized local package runtime route backed directly by the shared
read-only reader. The route presents package identity, release-bound QR
fallbacks, curated game paths, media kinds, and explicit safety boundaries. It
links only to package-declared local application paths and shows blocked or
missing-package states without attempting repair or activation.

## Consequences

- A released local package now has a visible handoff surface suitable for
  teacher and publisher rehearsal.
- The route is still not a release or student-data workflow; the existing
  release, policy, persistence, and learner-data gates remain separate.
- A tenant registry must provide the final branded tenant configuration before
  a new publisher package is delivered outside the current sample tenants.

