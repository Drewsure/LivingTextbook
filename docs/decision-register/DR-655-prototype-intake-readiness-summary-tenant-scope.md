# DR-655: Prototype Intake Readiness Summary Tenant Scope

Status: Accepted

Decision: Require tenant-scoped readiness summary records and pass the same scoped summary to the tenant alert and readiness panels.

Guardrails:

- Platform readiness uses the explicit `platform` scope.
- Tenant routes must construct their own summary/alert pair.
- The scoped preview remains review-only and cannot authorize import, promotion, route creation, or assignment.

Related ADR: `docs/adr/0583-prototype-intake-readiness-summary-tenant-scope.md`
