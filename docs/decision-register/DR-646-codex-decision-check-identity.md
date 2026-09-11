# DR-646: Codex Decision Check Identity

Status: Accepted

Decision: Require unique labels and required records for every Codex
integration-decision evidence check, with non-empty evidence and supported
review statuses.

Guardrails:

- Duplicate labels and duplicate required records are rejected.
- Missing label, evidence, or required-record fields are rejected.
- Unsupported check statuses are rejected.
- No integration approval, app write, route change, scoring/reward change,
  playlist write, package promotion, or assignment is enabled.

Related ADR: `docs/adr/0574-codex-decision-check-identity.md`
