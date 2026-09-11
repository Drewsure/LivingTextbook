# DR-663: Explicit Review-Surface Scope

Status: Accepted

Decision: Require evidence packet flows and prototype storage guards to declare platform or tenant scope and render that scope visibly.

Guardrails:

- Platform policy cannot be mistaken for tenant evidence.
- Tenant-specific records cannot omit scope classification.
- Scope labels remain review metadata and cannot authorize live storage, import, promotion, or assignment.

Related ADR: `docs/adr/0591-explicit-review-surface-scope.md`
