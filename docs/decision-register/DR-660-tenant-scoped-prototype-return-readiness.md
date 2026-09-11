# DR-660: Tenant-Scoped Prototype Return Readiness

Status: Accepted

Decision: Tenant prototype workbenches must derive returned-package readiness from tenant-filtered checklist records rather than reuse a platform-wide return summary.

Rationale:

- White-label tenants must not inherit another tenant's returned package, evidence, or review status.
- Return readiness needs the same tenant boundary already enforced for prototype intake readiness.

Guardrails:

- Every return summary carries a tenant ID.
- Missing tenant checklists remain missing.
- Tenant scoping does not authorize archive import, route replacement, package promotion, or assignment.

Related ADR: `docs/adr/0588-tenant-scoped-prototype-return-readiness.md`
