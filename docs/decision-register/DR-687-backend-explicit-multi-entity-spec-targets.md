# DR-687: Explicit Multi-Entity Spec Targets

Status: Accepted

## Decision

Every actionable specification for a multi-entity migration candidate must
declare explicit materialization targets. Missing explicit targets are a
backend alignment error.

## Evidence

- Current package release, package/audio coverage, release-candidate, and
  game-settings specifications declare explicit targets.
- Regression coverage rejects removal of explicit targets from a multi-entity
  candidate specification.
- Deferred local export work remains deferred without implementation specs.

This decision is recorded in
`docs/adr/0615-backend-explicit-multi-entity-spec-targets.md`.
