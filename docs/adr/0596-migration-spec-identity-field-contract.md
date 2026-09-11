# ADR-0596: Migration Spec Identity Field Contract

Status: Accepted

## Decision

Every vendor-neutral migration specification must declare its `primaryKey` in
the specification's `fields` list. Field names and field types must also be
non-empty.

The backend contract alignment validator checks this before a migration is
treated as coherent.

## Why

A primary key described only in metadata cannot be implemented consistently by
hosted or closed/local storage. Requiring the identity field in the declared
record shape keeps the migration contract executable without pretending that
every migration spec must duplicate every field in the broader schema draft.

## Guardrails

- This is a contract check only; it does not select a database vendor or enable
  live persistence.
- Upload, approval, promotion, download, and student-facing use remain
  independently gated.
- Full schema-to-migration field parity remains intentionally out of scope
  until individual migrations are designed for implementation.

## Consequences

Migration authors receive an immediate failure when a record's declared
identity is absent from its fields. Hosted and local adapters can therefore
build from the same explicit identity vocabulary.
