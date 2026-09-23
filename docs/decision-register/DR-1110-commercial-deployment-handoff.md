# DR-1110: Commercial Deployment Handoff

## Decision

Add a review-only commercial deployment handoff packet that binds hosted PWA,
local classroom server, and packaged companion artifacts to the shared
continuity decision and activation preflight.

## Required invariants

- Tenant and package identity remain explicit.
- Exactly three product-path artifacts are present.
- Each artifact carries deliverables, evidence bindings, and blockers.
- Export, installation, activation, and QR/route mutation remain false.
- The packet has no provider selection, billing action, storage write, or
  classroom launch behavior.

## Scope

This decision changes the shared content model, teacher deployment review
surface, runtime harness, and route expectations only. It does not import or
promote frozen Z.ai/Phaser source and does not enable a live deployment.

## Status

Implemented and verified as review-only evidence.
