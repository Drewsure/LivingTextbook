# ADR 0880: Persistence Effective Readiness

## Status

Accepted for foundation hardening.

## Context

The persistence status endpoint reports both an operational status and a
`healthy` field. Durable SQLite policy failures were previously visible in the
status branch but were not included in the health calculation, allowing the two
signals to disagree.

## Decision

Compute one effective readiness error set. For durable deployments it includes
provider, storage-health, session-boundary, operation-integrity, and durable
policy errors. Non-durable rehearsal keeps durable-operation policy errors out
of its health signal, while remaining explicitly rehearsal rather than
production-ready.

## Consequences

Launch and pilot tooling can rely on one coherent readiness result. A durable
deployment cannot appear healthy while its school, retention, release, or
durable-write policy gates remain open.
