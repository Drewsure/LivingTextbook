# DR-647: Codex Decision Collection Identity

Status: Accepted

Decision: Reject Codex integration-decision collections containing duplicate
decision IDs or duplicate tenant/request pairs.

Guardrails:

- Decision IDs must be unique across the review collection.
- Each tenant and prototype request may have only one decision packet.
- The guard remains provider-neutral and review-only.
- No integration approval, import, route write, scoring/reward change,
  package promotion, playlist write, or assignment is enabled.

Related ADR: `docs/adr/0575-codex-decision-collection-identity.md`
