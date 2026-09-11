# ADR-0557: Persistence Contract Alignment

Status: Accepted  
Date: 2026-09-11

## Decision

Validate durable record contracts and hosted/local persistence adapter plans
together for the tenant-bound storage surface.

## Context

The repository already validates each layer independently. That protects the
shape of each artifact, but it cannot detect a category that exists only in one
layer or an adapter that names a different tenant boundary mapping. Review-only
records also need a deliberate exception so the foundation does not imply that
every evidence artifact is ready for live storage.

## Rules

- Progress-event, teacher-report, and every external-prototype evidence and
  patch-review category must exist in both layers.
- Each adapter intent must use the durable contract's `tenantBoundaryKey`.
- A durable record that stores raw audio cannot be paired with an adapter that
  rejects raw audio.
- Other review-only records may remain unpaired until a storage decision is
  made.

## Consequences

The teacher persistence pages show alignment failures beside normal adapter
validation failures. This remains a no-side-effect foundation gate: it does
not choose a backend, activate storage, import Z.ai or Phaser code, or enable
student assignment.
