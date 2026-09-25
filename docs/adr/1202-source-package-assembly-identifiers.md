# ADR 1202: Source Package Assembly Identifiers

## Decision

Source-package assembly packets must validate bounded safe packet, tenant,
source, package, extraction, approval-ledger, candidate-unit, and media-asset
identities. Namespaced unit keys remain supported; path-like identities do not.

## Why

Assembly is the handoff between extraction evidence and teacher-draft review.
Its identifiers are used for cross-record reconciliation and tenant-scoped
media mapping, so they must not be weaker than the preview records they bind.

## Consequences

- Assembly packets remain review-only and promotion-blocked.
- Candidate media and unit identities can be reconciled safely across hosted and
  local deployment paths.
- This does not create storage, activate a package, or assign students.
