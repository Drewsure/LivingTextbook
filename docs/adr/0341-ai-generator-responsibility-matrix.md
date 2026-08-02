# ADR 0341: AI Generator Responsibility Matrix

## Status

Accepted

## Context

The platform can use outside AI builders such as Z.ai for isolated game prototypes, but production readiness depends on a clear separation of responsibility. Without a visible role map, a prototype, verifier result, or teacher approval could be mistaken as permission to patch the app, create routes, change scoring, assemble packages, or assign students.

## Decision

Add a review-only AI generator responsibility matrix to tenant generator routes.

The matrix separates:

- teacher and school review
- Codex architecture and integration
- outside AI builder / Z.ai prototype work
- verifier layer checks
- platform admin cost, storage, entitlement, and release duties

## Consequences

- Z.ai and outside builders can be used productively without owning production integration.
- Codex remains responsible for schema discipline, parent-engine boundaries, app integration, route safety, and final review.
- Teachers retain classroom-fit and approval responsibility without gaining direct publish authority.
- Verifier checks remain validation gates, not live workflow actions.
- Platform admins keep API cost, storage, release, and premium feature decisions separate from children-facing surfaces.
