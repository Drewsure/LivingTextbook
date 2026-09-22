# Build Session: Evidence Handoff Canonical Scope

## Goal

Make the teacher evidence-packet handoff a coherent, tenant-scoped review
packet that can later become durable without creating export or approval side
effects.

## Completed

- Promoted the evidence handoff types and validator into `packages/content-model`.
- Bound the sample evidence handoff to the canonical pilot package and stable
  route key.
- Added teacher-visible contract status and identity facts.
- Added static scope verification and active-route expectations.
- Preserved export, approval capture, publish, promotion, route creation,
  playlist creation, and assignment blockers.

## Next gate

Run the full foundation composition, production build, and 88-route sweep.
Then continue toward a single teacher review decision surface that reconciles
the canonical pilot handoff and evidence packet without enabling live actions.
