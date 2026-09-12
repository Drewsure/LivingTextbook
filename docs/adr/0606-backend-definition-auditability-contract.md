# ADR-0606: Backend Definition Auditability Contract

Status: Accepted

## Decision

Backend schema, migration-plan, and migration-spec definitions must carry
non-empty identity and explanatory metadata. Schema entities require purposes,
migration notes, relationship notes, and field notes; migration fields also
require field notes.

## Why

The platform is preparing for multiple white-label storage deployments and
eventual outside game integration. A field or relationship that exists only as
an unexplained technical shape is not safe to hand to a backend adapter or an
external builder.

## Guardrails

- This validates documentation quality; it does not turn prose into runtime
  authorization.
- It does not choose a vendor or enable persistence, uploads, or integration.
- Policy, tenant, release, and student-data controls remain independently
  required.

## Consequences

Future schema and migration edits must explain what each record and field is
for before the definition can pass the foundation gate.
