# Build Session: Package Readiness Source Lineage Binding

## Goal

Prevent package-readiness evidence from referring to a stale or substituted
source assembly record.

## Change

Package readiness reconciliation now carries the source assembly checksum, and
the hosted/local metadata-preview persistence intent preserves it in the
evidence lane references. Runtime and static verifiers reject malformed source
checksums while retaining all promotion and write blockers.

## Boundary

This remains evidence-only. It does not create storage, publish a package,
activate routes, assign students, or integrate frozen Z.ai/Phaser source.

## Verification

- package readiness reconciliation verifier
- package readiness persistence verifier
- source review queue verifier
- runtime behavior harness
- web typecheck
