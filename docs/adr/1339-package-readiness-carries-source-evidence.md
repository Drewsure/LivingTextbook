# ADR 1339: Package Readiness Carries Source Evidence

## Status

Accepted for the foundation and pilot-review track.

## Decision

The tenant-authorized package-readiness binding response must include the
validated source-to-package evidence bridge for the same quarantine and package
identity. The publisher handoff must render that returned bridge rather than
performing an independent source-evidence read for its readiness view.

The source bridge remains a separate evidence object and does not alter the
package-readiness status model or unlock any protected action.

## Rationale

The saleable pilot needs one coherent publisher review conversation. Returning
source provenance and package readiness from one authenticated projection
reduces race conditions, duplicate authorization paths, and contradictory
summaries while preserving separate evidence gates.

## Consequences

- A handoff refresh observes one tenant-scoped source/package snapshot.
- Source evidence remains visible even when package readiness is blocked.
- Package assembly, release, QR, persistence, and student use remain blocked
  until their own gates pass.
- The focused readiness verifier is part of the foundation verification chain.
