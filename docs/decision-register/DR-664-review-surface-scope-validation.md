# DR-664: Review-Surface Scope Validation

Status: Accepted

Decision: Enforce `platform` or `tenant` scope values with a shared content-model validator for evidence flows and prototype storage guards.

Guardrails:

- Invalid scope values cannot be treated as review-ready metadata.
- Scope validation does not authorize storage, import, promotion, or assignment.

Related ADR: `docs/adr/0592-review-surface-scope-validation.md`
