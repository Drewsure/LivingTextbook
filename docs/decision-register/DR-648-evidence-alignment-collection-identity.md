# DR-648: Evidence Alignment Collection Identity

Status: Accepted

Decision: Reject evidence-alignment collections containing duplicate return
review IDs, integration plan IDs, or tenant/request pairs.

Guardrails:

- Alignment remains a review-only evidence check.
- Duplicate packet identities are rejected before readiness summaries rely on
  the collection.
- No provider-specific import or app integration is enabled.

Related ADR: `docs/adr/0576-evidence-alignment-collection-identity.md`
