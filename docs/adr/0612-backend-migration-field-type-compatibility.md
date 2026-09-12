# ADR-0612: Backend Migration Field Type Compatibility

Status: Accepted

## Decision

Migration specification field types must be compatible with the type declared
by their targeted schema field. Compatibility may use an approved portable
representation, such as a stable identifier stored as `string`, an enum stored
as `string enum`, or structured JSON stored as `json`.

Incompatible substitutions, such as storing a stable identifier as an
`integer`, are rejected before adapter implementation.

## Why

Migration specs already describe portable storage forms rather than copying
every semantic type literally. Exact string equality would reject valid plans,
while unconstrained conversion would allow data loss and provider drift. A
small explicit compatibility map provides the intended middle ground.

## Guardrails

- Compatibility is explicit and code-reviewed; it is not inferred from a
  provider SDK.
- New conversions require a vocabulary update, regression coverage, and a
  written export/round-trip consideration.
- Type compatibility does not authorize writes, migration execution, or
  learner-data collection.

## Consequences

The backend boundary now protects both semantic shape and deliberate portable
serialization. Hosted, local, and hybrid adapters must preserve the approved
mapping in both persistence and export paths.
