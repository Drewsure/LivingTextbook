# DR-659: Prototype Return Readiness Summary Contract

Status: Accepted

Decision: Validate prototype-return readiness summaries for summary identity, lane identity, derived status, Codex return-review consistency, and blocked next actions before relying on the return panel.

Guardrails:

- A manually changed status cannot override its return-readiness lanes.
- Duplicate or malformed lanes are rejected.
- A valid return summary remains review-only and cannot authorize archive import, app file copy, route replacement, package promotion, or assignment.

Related ADR: `docs/adr/0587-prototype-return-readiness-summary-contract.md`
