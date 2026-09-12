# DR-675: Backend Definition Integrity Contract

Status: Accepted

## Decision

The backend alignment validator now rejects blank or duplicate schema and
migration indexes, repeated migration entity targets, and migration fields
whose `required` property is not boolean.

## Rationale

- Vendor-neutral definitions must be deterministic before adapter work.
- Duplicate targets can cause ambiguous migration ownership.
- Explicit field shapes reduce divergence between hosted and local stores.

## Evidence

- Sample schema and migration definitions pass the new rules.
- Regression coverage exercises duplicate indexes, duplicate targets, and a
  malformed migration field.

This decision is recorded in
`docs/adr/0603-backend-definition-integrity-contract.md`.
