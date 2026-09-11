# DR-624: Teacher Report Tenant Binding

Status: Accepted

Decision: Bind teacher-report event unit keys to the requested tenant ID.

Rationale:

- White-label isolation applies to reports as well as content and launches.
- Valid-looking telemetry from another tenant must not enter a report package.
- The canonical unit-key parser gives the report runtime a shared identity rule.

Guardrails:

- Cross-tenant `unit_key` values block report validation.
- Invalid unit keys remain blocked by envelope validation.
- Validation is review-only and has no export, persistence, gameplay, scoring, or provider side effect.

Related ADR: `docs/adr/0552-teacher-report-tenant-binding.md`
