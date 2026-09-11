# DR-653: Prototype Alert Panel Instance Validation

Status: Accepted

Decision: Validate each prototype-intake alert panel instance against its own alert payload and, when supplied, its own readiness signal.

Guardrails:

- Shared UI cannot use MiniStar sample validation as tenant-wide truth.
- Tenant-specific readiness must remain aligned with the readiness signal passed to that route.
- Validation remains review-only and does not authorize import or student-facing use.

Related ADR: `docs/adr/0581-prototype-alert-panel-instance-validation.md`
