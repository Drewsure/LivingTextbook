# DR-669: Required Migration Identity Field

Status: Accepted

## Decision

Every migration specification must mark its declared primary key field as
required.

## Rationale

- Optional identity fields cannot safely address, join, export, or roll back a
  record.
- Hosted and closed/local implementations need one identity contract.
- The rule strengthens the migration boundary without falsely requiring full
  schema-field duplication.

## Guardrails

- This does not enable live persistence or select a backend vendor.
- Upload, approval, promotion, download, and student-facing use remain behind
  their existing gates.

## Evidence

- Backend alignment validates required primary-key fields.
- Regression coverage rejects a media migration spec with an optional
  `media_id`.

This decision is recorded in
`docs/adr/0597-required-migration-identity-field.md`.
