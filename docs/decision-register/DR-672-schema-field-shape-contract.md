# DR-672: Schema Field Shape Contract

Status: Accepted

## Decision

Schema entities require at least one field, and schema fields require a
non-empty name, non-empty type, and boolean `required` value.

## Rationale

- Runtime data can bypass TypeScript's compile-time guarantees.
- Hosted and closed/local backend planning needs a stable field vocabulary.
- Early structural rejection is cheaper than discovering malformed records in
  a vendor migration.

## Guardrails

- This does not enable live persistence or select a backend vendor.
- Full schema-to-migration parity remains intentionally scoped and separate.

## Evidence

- Backend alignment validates schema field shape.
- Regression coverage rejects a tenant schema field with an empty type.

This decision is recorded in
`docs/adr/0600-schema-field-shape-contract.md`.
