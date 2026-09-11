# DR-630: Backend Contract Alignment

Status: Accepted

Decision: Keep schema entities, migration candidates, and migration
specifications aligned through a read-only verifier before vendor-specific
backend implementation.

Guardrails:

- Migration targets must resolve to schema entities.
- Migration specs must resolve to candidates.
- Primary keys, tenant scopes, and unique field names are required.
- No live writes, migration execution, provider selection, or Z.ai import is
  enabled.

Related ADR: `docs/adr/0558-backend-contract-alignment.md`
