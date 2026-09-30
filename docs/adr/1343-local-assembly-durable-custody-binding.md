# ADR 1343: Bind Local Assembly To Durable Delivery Custody

## Status

Accepted for the first saleable white-label pilot.

## Decision

The local package assembly endpoint must read the approved delivery metadata
and QR alias registry from their configured custody roots before invoking the
local writer. The submitted manifest, release receipt, package index, and QR
registry must match those stored records by canonical JSON identity.

## Context

Local assembly is the point where a reviewed package becomes a reproducible
closed-local handoff. Validating request-shaped objects alone would allow a
caller to present an approval-looking receipt or registry without the prior
release and QR custody writes that the pilot contract requires.

## Consequences

- The operator path is ordered: release metadata and QR registry first, then
  local package assembly.
- Replays remain idempotent; mismatches fail closed.
- The route still requires source lineage, sentence approval, package review,
  explicit writer gates, and approved bundle assets.
- No student activation, hosted persistence, or QR alias mutation is added.
