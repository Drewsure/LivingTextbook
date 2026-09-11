# ADR-0563: Returned Artifact Shape

Status: Accepted  
Date: 2026-09-11

## Decision

Fail closed when a returned package artifact is malformed or when the package
does not identify its target mode and parent engine. A review-only package must
mark every required artifact as reviewed.

## Why

Evidence manifests are only useful if missing, malformed, and merely present
artifacts remain distinguishable. Silent dropping would make a partial return
look like a clean preview and could weaken the parent-engine review boundary.

## Guardrails

- Supported artifact kinds and statuses are explicit.
- Artifact IDs, safe paths, and checksums are validated before review.
- Review-only evidence must be marked `reviewed`.
- No import, route replacement, scoring mutation, package promotion, or
  student assignment is enabled.

## Verification

The validator is
`packages/content-model/src/aiPrototypeReturnedPackageManifest.ts`.
The runtime assertions are in `scripts/verify-runtime-behavior.mjs`.
