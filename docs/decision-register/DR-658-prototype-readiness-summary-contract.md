# DR-658: Prototype Readiness Summary Contract

Status: Accepted

Decision: Validate prototype-intake readiness summaries for tenant identity, lane identity, derived status, Codex-alert consistency, and blocked next actions before relying on them in review panels.

Guardrails:

- A manually changed status cannot override its lane collection.
- Duplicate or malformed lanes are rejected.
- A valid summary remains review-only and cannot authorize Z.ai import, package promotion, route creation, or assignment.

Related ADR: `docs/adr/0586-prototype-readiness-summary-contract.md`
