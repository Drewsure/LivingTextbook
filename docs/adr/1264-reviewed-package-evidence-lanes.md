# ADR 1264: Reviewed Package Evidence Lanes

## Status

Accepted for the first saleable white-label pilot foundation.

## Decision

Add an immutable, tenant-bound package evidence review sidecar to each real
quarantine submission. It records complete or incomplete review coverage for
content, games, audio, video, images, fonts, accessibility, and rights. A
complete sidecar closes only the reviewed package preview check.

The sidecar is metadata-only, checksum-bound, feature-gated, idempotent for
identical replay, and conflict-safe. It cannot upload or promote assets and
cannot authorize package assembly, release, QR printing, hosted persistence, or
student use.

## Rationale

The saleable pilot needs a truthful evidence handoff for the publisher's
multimedia/game package before any writer or deployment adapter is considered.
The lane record gives reviewers a concrete checklist without collapsing review
evidence into release authority.

## Consequences

- The live handoff can show exactly which package lanes remain open.
- Complete evidence improves readiness visibility without creating a hidden
  package writer.
- A human still must provide source/media evidence and approve independent
  release, QR, local, and hosted decisions.
