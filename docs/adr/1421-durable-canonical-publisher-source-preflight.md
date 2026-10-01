# ADR 1421: Durable Canonical Publisher Source Preflight

- **Status:** Accepted
- **Date:** 2026-10-02

## Context

The publisher pilot has two distinct source gates: the intake kit inventories
the declared handoff, while canonical source preflight validates the generated
manifest against the actual source directory. Treating the first as the whole
source gate would allow the saleability audit to advance before canonical
source review evidence exists.

## Decision

Require an external publisher handoff to contain
`publisher-source-manifest.json` and the create-once
`evidence/publisher-source-preflight.json` report. The audit reruns the
canonical preflight in a temporary comparison lane and requires matching
manifest checksum, inventory checksum, report identity, complete inventory,
and review-only protected actions.

## Consequences

- Source review evidence is durable and cannot silently become stale.
- The audit does not copy, upload, promote, assemble, print, activate, or
  expose student content.
- Operators must rerun to a new evidence location after changing the source
  manifest or inventory.

See `docs/decision-register/DR-1421-durable-canonical-publisher-source-preflight.md`.
