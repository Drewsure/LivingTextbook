# ADR 1293: Tenant-Scoped Evidence Handoff Empty State

Date: 2026-09-30  
Status: Accepted

## Context

The publisher journey now reaches tenant upload, source, evidence, and media
review shells. The evidence handoff route still displayed the Sample Publisher
package for one tenant only and rejected a new tenant before it could inspect
its own quarantine handoff.

## Decision

Resolve the handoff route through the shared tenant resolver. Keep the dynamic
quarantine bridge available for any safe tenant when a tenant-bound quarantine
identity is supplied. Render the populated package, delivery, reconciliation,
and handoff panels only for the tenant that owns those sample records. Other
safe tenants receive an empty blocked handoff state.

## Consequences

- The white-label review path can continue from evidence into handoff without
  leaking Sample Publisher data.
- A real quarantine submission can be inspected through the existing
  tenant-bound bridge before static package records exist.
- No empty handoff state implies that a package is ready for release.
- Export, signing, package assembly, QR, playlist, assignment, and student
  use remain independently blocked.

See DR-1009.
