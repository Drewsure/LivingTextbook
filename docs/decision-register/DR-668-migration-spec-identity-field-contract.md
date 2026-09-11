# DR-668: Migration Spec Identity Field Contract

Status: Accepted

## Decision

Migration specifications must declare their `primaryKey` in `fields`, and
every migration field must declare a non-empty name and type.

## Rationale

- A primary key that exists only in descriptive metadata is not an
  implementable storage contract.
- Hosted and closed/local deployments need the same record identity shape.
- Narrow identity validation is safer than falsely requiring full field parity
  while the vendor-neutral specs remain intentionally implementation-light.

## Guardrails

- This does not enable live persistence or select a backend vendor.
- Upload, approval, promotion, download, and student-facing use remain behind
  their existing gates.

## Evidence

- Backend alignment validates identity-field presence and field shape.
- Regression coverage rejects a media migration spec with `media_id` removed.

This decision is recorded in
`docs/adr/0596-migration-spec-identity-field-contract.md`.
