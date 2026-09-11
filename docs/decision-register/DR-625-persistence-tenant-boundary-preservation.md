# DR-625: Persistence Tenant-Boundary Preservation

Status: Accepted

Decision: Persisted progress-event and teacher-report contracts must preserve tenant-boundary evidence.

Rationale:

- White-label isolation must survive storage and local export.
- Provider implementations must not depend on a UI-only check.
- One shared flag keeps hosted and local adapters aligned.

Guardrails:

- Progress-event and teacher-report durable records require `preservesTenantBoundary`.
- Their hosted and local write intents require the same field.
- The check is review-only and does not activate storage.

Related ADR: `docs/adr/0553-persistence-tenant-boundary-preservation.md`
