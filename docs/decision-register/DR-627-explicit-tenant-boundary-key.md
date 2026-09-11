# DR-627: Explicit Tenant Boundary Key

Status: Accepted

Decision: Tenant-scoped persistence records and write intents must name the concrete `tenantBoundaryKey` mapping used by storage.

Mappings:

- Progress and teacher reports: `canonical_unit_key.tenant_id`.
- Prototype readiness and Codex decisions: `tenant_id`.

This is a backend-neutral contract check. It does not authorize provider selection, live writes, source import, route changes, scoring changes, package promotion, or student assignment.
