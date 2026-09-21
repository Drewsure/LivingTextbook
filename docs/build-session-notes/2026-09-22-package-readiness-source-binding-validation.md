# Build Session: Package Readiness Source Binding Validation

## Goal

Make package-readiness evidence fail closed when it points at a stale,
cross-tenant, cross-package, or substituted source assembly packet.

## Change

Added a shared validator that compares tenant, target package, assembly packet
id, and source checksum across the two records. Sample reconciliation data now
executes this comparison, and runtime/static verification covers both a valid
binding and a tenant mismatch.

## Boundary

The comparison remains review-only. It does not upload files, create package
records, promote content, select storage, assign students, or integrate frozen
Z.ai/Phaser source.

## Verification

- runtime behavior harness
- package readiness reconciliation verifier
- source review queue verifier
- web typecheck
