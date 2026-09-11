# DR-667: Evidence Migration Field Parity

Status: Accepted

## Decision

Evidence packet and evidence attachment migration specifications must preserve
their required identity, scope_kind, and tenant_id fields from the
vendor-neutral schema.

## Rationale

- Prose and indexes cannot substitute for required migration fields.
- Schema-to-migration drift should fail before backend vendor selection.
- Hosted and local implementations need the same record vocabulary.

## Guardrails

- Migration parity does not enable live persistence.
- Evidence upload, approval, promotion, download, and student-facing use
  remain blocked.

## Evidence

- Required fields added to both evidence migration specifications.
- Backend alignment validator checks the evidence field map.
- Regression coverage rejects an evidence spec with tenant_id removed.
