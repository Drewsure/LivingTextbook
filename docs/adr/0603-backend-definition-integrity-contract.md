# ADR-0603: Backend Definition Integrity Contract

Status: Accepted

## Decision

Backend schema entities and migration specifications must reject blank or
duplicate index declarations. Migration candidates must not repeat a schema
entity target, and migration fields must declare `required` as a boolean.

## Why

The platform is intentionally vendor-neutral while hosted, closed/local, and
hybrid storage options are evaluated. Small definition defects can otherwise
become divergent indexes, ambiguous migrations, or unsafe generated schemas
when a backend adapter is eventually introduced.

## Guardrails

- This is a contract check only; it does not select a database vendor.
- It does not enable live persistence, uploads, student data, or migration
  execution.
- Tenant ownership and tenant-aware indexes remain separately required.

## Consequences

Future schema and migration authors must keep index declarations unique and
non-empty, migration targets unambiguous, and field shape explicit before a
storage implementation can be considered coherent.
