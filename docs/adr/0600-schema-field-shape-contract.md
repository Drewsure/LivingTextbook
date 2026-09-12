# ADR-0600: Schema Field Shape Contract

Status: Accepted

## Decision

Every vendor-neutral backend schema entity must declare at least one field, and
each field must have a non-empty name, non-empty type, and boolean `required`
flag.

The backend contract alignment validator checks this before migration design is
treated as coherent.

## Why

The schema draft is consumed as structured data by hosted and closed/local
planning tools. TypeScript catches mistakes during compilation, but generated
or externally supplied data can still arrive malformed at runtime. The
contract must validate its own field shape before it is used to design storage.

## Guardrails

- This is a contract check only; it does not select a database vendor or enable
  live persistence.
- It does not require full schema-to-migration field parity for intentionally
  narrow pilot specs.
- Upload, approval, promotion, download, and student-facing use remain
  independently gated.

## Consequences

Malformed schema data fails early with a specific entity and field message,
making generated or imported backend plans safer to review and compare.
