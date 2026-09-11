# DR-656: Derived Tenant Prototype Readiness

Status: Accepted

Decision: Derive tenant prototype readiness lanes from tenant-filtered queue, evidence, returned-manifest, and package-availability records.

Guardrails:

- Missing tenant records remain visibly missing.
- Platform-wide previews cannot make a tenant route appear ready.
- The derived summary remains review-only and cannot authorize Z.ai import, package promotion, route creation, or assignment.

Related ADR: `docs/adr/0584-derived-tenant-prototype-readiness.md`
