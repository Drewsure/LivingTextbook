# DR-654: Prototype Intake Alert Tenant Scope

Status: Accepted

Decision: Require explicit tenant identity on prototype-intake alerts and reject route displays whose expected tenant differs from the alert tenant.

Guardrails:

- The platform route uses `platform`; tenant routes construct tenant-scoped alert records.
- Tenant scope does not authorize import, integration approval, route creation, package promotion, or student assignment.
- Z.ai and Phaser evidence remains isolated until the full return and integration gates close.

Related ADR: `docs/adr/0582-prototype-intake-alert-tenant-scope.md`
