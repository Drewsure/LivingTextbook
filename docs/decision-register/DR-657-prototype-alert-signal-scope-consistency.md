# DR-657: Prototype Alert and Signal Scope Consistency

Status: Accepted

Decision: Require the prototype-intake alert tenant and readiness-signal tenant to match during alignment validation.

Guardrails:

- Route, alert, and readiness summary scopes must agree.
- A valid alignment check remains review-only.
- Import, package promotion, route creation, scoring/reward mutation, and assignment remain blocked.

Related ADR: `docs/adr/0585-prototype-alert-signal-scope-consistency.md`
